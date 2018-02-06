
# coding: utf-8

# In[3]:


import struct
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.cm as cm
import math

class GPPhase:
    def __init__(self):
        self.pdg=0
        self.x=0
        self.y=0
        self.z=0
        self.px=0
        self.py=0
        self.pz=0
        self.e=0
    
class GPPhaseReader:
    def __init__(self):
        self.read=0
        self.file_h=""
        self.count=0
    def Open(self,fname):
        self.file_h=open(fname,'rb')
        self.count,=struct.unpack('q',self.file_h.read(8))
        print("There are %.2e phase records. " % self.count)
    def Next(self):
        ph=GPPhase()
        res=struct.unpack('1i7f',self.file_h.read(32))
        ph.pdg=res[0]
        ph.x=res[1]
        ph.y=res[2]
        ph.z=res[3]
        ph.px=res[4]
        ph.py=res[5]
        ph.pz=res[6]
        ph.e=res[7]
        self.read+=1
        return ph
    def Reset(self):
        self.file_h.seek(8)
        self.read=0
    def Unread(self):
        return self.count - self.read
    def Size(self):
        return self.count
    
class GPMesh:

    def __init__(self,fname=None,Name="ct_body/dose"):
        self.Name='unknown'
        #(z,y,x)
        self.Size=(0,0,0)
        #(z,y,x)
        self.Bin=(1,1,1)
        #(z,y,x)
        self.Pix=(1,1,1)
        self.Data=[]
        self.Min=(0,0,0)
        self.Name=Name
        
        if fname !=None:
            self.Read(fname)
    def Init(self,Size,Min,Bin,Name="ct_body/dose"):
        self.Name=Name
        self.Size=np.array(Size)[0:3]
        self.Min=np.array(Min)[0:3]
        self.Bin=np.array(Bin,dtype=np.int32)[0:3]
        self.Pix=self.Size/self.Bin
        self.Data=np.zeros(self.Bin)
    
    def Print(self):
        print('Name:  ', self.Name)
        print('Size:  ',self.Size)
        print('Bin:  ', self.Bin)
        print('Pix:  ', self.Pix)
        print('Min:  ', self.Min)
        print('Data bin:  ', self.Data.shape)
    def Read(self,file_name):
        f=open(file_name,'rb')
        fmt='i'
        l=struct.unpack(fmt,f.read(4))[0]
        #fmt='%ss' % l
        #self.Name,=struct.unpack(fmt,f.read(l))
        tag=struct.unpack("%is" % l, f.read(l))[0]
        self.Name = tag.decode("utf-8")
        fmt='3f'
        self.Size=struct.unpack(fmt,f.read(12))
        self.Size=(self.Size[2]/10,self.Size[1]/10,self.Size[0]/10)
        fmt='3i'
        self.Bin=struct.unpack(fmt,f.read(12))
        self.Bin=(self.Bin[2],self.Bin[1],self.Bin[0])
        self.Pix=(self.Size[0]/self.Bin[0],self.Size[1]/self.Bin[1],self.Size[2]/self.Bin[2])
        self.Min=(0,-self.Size[1]/2,-self.Size[2]/2)
    
        l=self.Bin[0]*self.Bin[1]*self.Bin[2]
        fmt='%sf' % l
        #print(fmt)
        data=struct.unpack(fmt,f.read(l*4))
        #Explain to numpy.reshape        
        #https://docs.scipy.org/doc/numpy/reference/generated/numpy.reshape.html        
        self.Data=np.reshape(data,self.Bin)
        f.close()
    def Write(self,file_name):
        fh=open(file_name,"wb")
        name_utf8 = self.Name.encode("utf-8")
        leng=np.int32(len(name_utf8))
        fh.write(leng.astype("i").tostring())
        fh.write(name_utf8)
        data=np.array((self.Size[2]*10,self.Size[1]*10,self.Size[0]*10), dtype=np.float32)
        fh.write(data.astype('f').tostring())
        data=np.array((self.Bin[2],self.Bin[1],self.Bin[0]), dtype=np.int32)
        fh.write(data.astype('i').tostring())
        fh.write(self.Data.astype('f').tostring())
        fh.close()
    def GetZSection(self,z):
        return self.Data[int(z),:,:]
    def GetYSection(self,y):
        return self.Data[:,int(y),:]
    def GetXSection(self,x):
        return self.Data[:,:,int(x)]
    def MergeIn(self,other_mesh):
        if(self.Name != other_mesh.Name):
            print("The name is different, abort merge.")
            return 0
        if(self.Size != other_mesh.Size):
            print("The size is different, abort merge.")
            return 0
        if(self.Bin != other_mesh.Bin):
            print("The bin is different, abort merge.")
            return 0 
        self.Data += other_mesh.Data

   


# In[4]:


#segment smooth function.
#https://stackoverflow.com/questions/22988882/how-to-smooth-a-curve-in-python
#https://stackoverflow.com/questions/28536191/how-to-filter-smooth-with-scipy-numpy
#http://scipy-cookbook.readthedocs.io/items/SignalSmooth.html
#https://en.wikipedia.org/wiki/Savitzky%E2%80%93Golay_filter
def savitzky_golay(y, window_size, order, deriv=0, rate=1):

    import numpy as np
    from math import factorial

    try:
        window_size = np.abs(np.int(window_size))
        order = np.abs(np.int(order))
    except ValueError:
        raise ValueError("window_size and order have to be of type int")
    if window_size % 2 != 1 or window_size < 1:
        raise TypeError("window_size size must be a positive odd number")
    if window_size < order + 2:
        raise TypeError("window_size is too small for the polynomials order")
    order_range = range(order+1)
    half_window = (window_size -1) // 2
    # precompute coefficients
    b = np.mat([[k**i for i in order_range] for k in range(-half_window, half_window+1)])
    m = np.linalg.pinv(b).A[deriv] * rate**deriv * factorial(deriv)
    # pad the signal at the extremes with
    # values taken from the signal itself
    firstvals = y[0] - np.abs( y[1:half_window+1][::-1] - y[0] )
    lastvals = y[-1] + np.abs(y[-half_window-1:-1][::-1] - y[-1])
    y = np.concatenate((firstvals, y, lastvals))
    return np.convolve( m[::-1], y, mode='valid')


# In[5]:


#1d histgram
class GPDist1D:
    def __init__(self):
        self.name="Unkown"
        self.size=np.array((1,1),dtype=np.float64)
        self.minm=np.array((1,1),dtype=np.float64)
        self.bins=np.array((1,1),dtype=np.int32)
        self.pix=np.array((1,1),dtype=np.float64)
        self.dist=np.array((1,1),dtype=np.float64)
    
    def Init(self,size,minm,bins):
        self.size=np.float64(size)
        self.minm=np.float64(minm)
        self.bins=np.int32(bins)
        self.pix=np.float64(self.size/self.bins)
        self.dist=np.zeros(self.bins,dtype=np.float64)
        print("size: ", self.size)
        print("min: ", self.minm)
        print("bins: ", self.bins)
        print("pix: ", self.pix)
    def Fill(self,val,weight):    
        x=(val-self.minm)/self.pix
        x=int(x)
        if(x<0 or x >=self.bins):
            return
        self.dist[x]+=weight
    def Write(self,fh):
        print("Write to file, %s" % self.name)
        fh.write(self.size.astype('d').tostring())
        fh.write(self.minm.astype('d').tostring())
        fh.write(self.bins.astype('i').tostring())
        fh.write(self.dist.astype('d').tostring())
    def Read(self,fh):
        print("Read from file, %s" % self.name)
        self.size=np.fromstring(fh.read(8),dtype=np.float64)[0]
        print("size: ", self.size)
        self.minm=np.fromstring(fh.read(8),dtype=np.float64)[0]
        print("min: ", self.minm)
        self.bins=np.fromstring(fh.read(4),dtype=np.int32)[0]
        print("Bins: ", self.bins)
        self.pix=self.size/self.bins
        self.dist=np.fromstring(fh.read(8*self.bins),dtype=np.float64)
    def Norm(self,scale=100):
        summ=np.sum(self.dist)
        if summ >0 :
            norm=scale/summ
            self.dist*=norm
    def Plot(self,tl="t",xl="x",yl="y"):
        matplotlib.rcParams['figure.figsize'] = (10.0, 10.0)
        x=np.linspace(self.minm,self.size+self.minm, self.bins)  
        plt.plot(x, self.dist,color='blue', ls="steps") 
        #color: http://matplotlib.org/api/colors_api.html
        plt.title(tl)# give plot a title
        plt.xlabel(xl)# make axis labels
        plt.ylabel(yl)
        plt.show()
        
#2d histgram
class GPDist2D(GPDist1D):
    def Init(self,size,minm,bins):
        self.size=np.array((size[0],size[1]),dtype=np.float64)
        self.minm=np.array((minm[0],minm[1]),dtype=np.float64)
        self.bins=np.array((bins[0],bins[1]),dtype=np.int32)
        self.pix=np.array((self.size[0]/self.bins[0],self.size[1]/self.bins[1]),dtype=np.float64)
        self.dist=np.zeros(self.bins,dtype=np.float64)
        print("size: ", self.size)
        print("min: ", self.minm)
        print("bins: ", self.bins)
        print("pix: ", self.pix)
    def Fill(self,val_x,val_y, weight):
        x=(val_x-self.minm[1])/self.pix[1]
        x=int(x)
        y=(val_y-self.minm[0])/self.pix[0]
        y=int(y)
        if(x<0 or x >=self.bins[1]):
            return
        if(y<0 or y >=self.bins[0]):
            return    
        self.dist[y,x]+=weight
        
    def Read(self,fh):
        print("Read from file, %s" % self.name)
        self.size=np.fromstring(fh.read(16),dtype=np.float64)
        self.minm=np.fromstring(fh.read(16),dtype=np.float64)
        self.bins=np.fromstring(fh.read(8),dtype=np.int32)
        self.pix=np.array((self.size[0]/self.bins[0],self.size[1]/self.bins[1]))
        self.dist=np.fromstring(fh.read(8*self.bins[0]*self.bins[1]),dtype=np.float64)
        self.dist=np.reshape(self.dist,self.bins)
        
    def Norm(self,scale=100):
        for i in range(0,self.bins[0]):
            summ=np.sum(self.dist[i,:])
            #print(i,summ)
            if summ <=0 :
                continue
            norm=scale/summ
            self.dist[i,:]*=norm
    def Plot(self,tl="t",xl="x",yl="y"):
        matplotlib.rcParams['figure.figsize'] = (10.0, 10.0)
        im=plt.imshow(self.dist,cmap=cm.jet,origin='lower',aspect='auto',
                   extent=[self.minm[1],self.minm[1]+self.size[1],self.minm[0],self.minm[0]+self.size[0]])
        plt.title(tl)
        plt.xlabel(xl)
        plt.ylabel(yl)
        plt.colorbar(im)  
        plt.show()


# In[6]:


# GPPhaseDistribution.
class GPPhaseDist:
    def __init__(self,fname=None):
        self.x_dist=GPDist1D()
        self.re_dist=GPDist2D()
        self.phi_dist=GPDist2D()
        self.rpz_dist=GPDist2D()
        self.theta_center=GPDist1D()
        self.mphi_center=GPDist1D()
        self.xy_dist=GPDist2D()
        #r_dist=GPDist1D()
        self.z_hist = np.float64(0.1622)
        self.tag="GPPhaseDistribution.2.0"
        """
        src z distribution
        """
        self.src_z_dist=GPDist1D()
        
        if fname is not None:
            self.Read(fname)
            return
        
    def Write(self,fname):
        fh=open(fname,"wb")
        tag_utf8 = self.tag.encode("utf-8")
        leng=np.int32(len(tag_utf8))
        fh.write(leng.astype("i").tostring())
        fh.write(tag_utf8)
        fh.write(self.z_hist.astype("d").tostring())
        self.x_dist.Write(fh)
        self.re_dist.Write(fh)
        self.phi_dist.Write(fh)
        self.rpz_dist.Write(fh)
        self.theta_center.Write(fh)
        self.mphi_center.Write(fh)
        self.xy_dist.Write(fh)
        #self.r_dist.Write(fh)
        self.src_z_dist.Write(fh)
        
        fh.close()
    def Read(self,fname):
        fh=open(fname,"rb")
        count=np.int32(np.fromstring(fh.read(4),dtype=np.int32)[0])
        tag=struct.unpack("%is" % count, fh.read(count))[0]
        self.tag = tag.decode("utf-8")
        self.z_hist=np.fromstring(fh.read(8),dtype=np.float64)[0]
        print("Tag: ", self.tag)
        print("Hist Z(m): ", self.z_hist)
        self.x_dist.Read(fh)
        self.re_dist.Read(fh)
        self.phi_dist.Read(fh)
        self.rpz_dist.Read(fh)
        self.theta_center.Read(fh)
        self.mphi_center.Read(fh)
        self.xy_dist.Read(fh)
        #self.r_dist.Read(fh)
        if self.tag=="GPPhaseDistribution.2.0":
            self.src_z_dist.Read(fh)
            
        fh.close()
        
    def Plot(self):
        self.x_dist.Plot()
        self.re_dist.Plot()
        self.phi_dist.Plot()
        self.rpz_dist.Plot()
        self.theta_center.Plot()
        self.mphi_center.Plot()
        self.xy_dist.Plot()
        self.src_z_dist.Plot()

    def Norm(self,scale=100):
        self.x_dist.Norm(scale)
        self.re_dist.Norm(scale)
        self.phi_dist.Norm(scale)
        self.rpz_dist.Norm(scale)
        self.theta_center.Norm(scale)
        self.mphi_center.Norm(scale)
        #self.xy_dist.Norm()
        self.src_z_dist.Norm(scale)


# In[7]:


#http://blog.csdn.net/omade/article/details/28231101
#http://blog.fangli.org/posts/chou-yang-fang-fa-2-cong-gao-si-fen-bu-shuo-qi/
#https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
#https://en.wikipedia.org/wiki/Marsaglia_polar_method

import numpy as np 

#initialize a normal distribution with frozen in mean=-1, std. dev.= 1
#rv = norm(loc = 0., scale = 200)
def gaussian(x, mu, sig):
    return np.exp(-np.power(x - mu, 2.) / (2 * np.power(sig, 2.)))


# In[25]:


class GPDist:

    def __init__(self,fname=None,Name="ct_body/dist"):
        self.Beg=0
        self.End=0
        self.Data=[]
        self.Name=Name
        
        if fname !=None:
            self.Read(fname)  
    def Print(self):
        print('Name:  ', self.Name)
        print('Beg:  ',self.Beg)
        print('End:  ', self.End)
        print('Data bin:  ', self.Data.shape)
    def Read(self,file_name):
        fh=open(file_name,'rb')
        count=np.fromstring(fh.read(4),dtype=np.int32)[0]
        self.Name=fh.read(count).decode("utf-8")
        self.Beg=np.fromstring(fh.read(4),dtype=np.int32)[0]
        self.End=np.fromstring(fh.read(4),dtype=np.int32)[0]
        count=np.fromstring(fh.read(4),dtype=np.int32)[0]
        self.Data=np.fromstring(fh.read(4*count),dtype=np.float32)
        fh.close()
    def Write(self,file_name):
        fh=open(file_name,"wb")
        name_utf8 = self.Name.encode("utf-8")
        leng=np.int32(len(name_utf8))
        fh.write(leng.astype("i").tostring())
        fh.write(name_utf8)
        data=np.array([self.Beg,self.End,self.Data.shape[0]], dtype=np.int32)
        fh.write(data.astype('i').tostring())
        fh.write(self.Data.astype('f').tostring())
        fh.close()  


# In[33]:


if __name__=="__main__":
    dist=GPDist("ct_in.gamma.energy.dist")
    dist.Print()
    plt.plot(dist.Data)
    plt.show()

