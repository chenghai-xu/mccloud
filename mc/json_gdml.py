
# coding: utf-8

# In[442]:

import xml.etree.cElementTree as ET
import json
import os
from datetime import *
from . import config


# In[443]:

#write xml
#https://stackoverflow.com/questions/3605680/creating-a-simple-xml-file-using-python


# In[444]:

def import_json(fname):
    json_data=None
    with open(fname) as f:
        json_data=json.load(f)
    if json_data['type'] != 'project':
        print('Invalid setup!')
        return None
    config=json_data['children']
    for item in config:
        print(item['type'])
    return config


# In[445]:

class GDML:
    def __init__(self):
        self.gdml=None
        self.define=None
        self.materials=None
        self.solids=None
        self.structure=None
        self.userinfo=None
        self.setup=None
        self.gdml=ET.Element("gdml")
        self.gdml.set("xmlns:gdml", "http://cern.ch/2001/Schemas/GDML")
        self.gdml.set("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
        self.gdml.set("xsi:noNamespaceSchemaLocation","file:///opt/GDML_3_1_4/schema/gdml.xsd")
        self.define=ET.SubElement(self.gdml, "define")
        self.materials=ET.SubElement(self.gdml, "materials")
        self.solids=ET.SubElement(self.gdml, "solids")
        self.structure=ET.SubElement(self.gdml, "structure")
        self.userinfo=ET.SubElement(self.gdml, "userinfo")
        #self.setup=ET.SubElement(self.gdml, "setup")
    def Write(self,fname):
        tree = ET.ElementTree(self.gdml)
        tree.write(fname)
    def AddVariable(self,name,value):
        child=ET.SubElement(self.define, "variable")
        child.set("name",name)
        child.set("value",str(value))
        return child
    def AddPosition(self,name,x,y,z,unit="cm"):
        child=ET.SubElement(self.define, "position")
        child.set("name",name)
        child.set("x",str(x))
        child.set("y",str(y))
        child.set("z",str(z))
        child.set("unit",unit)
        return child
    def AddRotation(self,name,x,y,z,unit="deg"):
        child=ET.SubElement(self.define, "rotation")
        child.set("name",name)
        child.set("x",str(x))
        child.set("y",str(y))
        child.set("z",str(z))
        child.set("unit",unit)
        return child
    def AddElement(self,name,formula,Z,atom):
        child=ET.SubElement(self.materials, "element")
        child.set("name",name)
        child.set("formula",formula)
        child.set("Z",str(Z))
        a=ET.SubElement(child, "atom")
        a.set("value",str(atom))
        return child
    
    def AddMaterialComposite(self,name,density,unit,cmps):
        return self.AddMaterial(name,density,unit,"composite",cmps)
    def AddMaterialFraction(self,name,density,unit,cmps):
        return self.AddMaterial(name,density,unit,"fraction",cmps)
    
    def AddMaterial(self,name,density,unit,cmp_type,cmps):
        child=ET.SubElement(self.materials, "material")
        child.set("name",name)
        d=ET.SubElement(child, "D")
        d.set("value",str(density))
        d.set("unit",unit)
        for item in cmps:
            cmp=ET.SubElement(child, cmp_type)
            cmp.set("ref",str(item[0]))
            cmp.set("n",str(item[1]))
        return child

    def AddMaterialZ(self,name,Z,density,atom,unit="g/cm3"):
        child=ET.SubElement(self.materials, "material")
        child.set("name",name)
        child.set("Z",str(Z))
        d=ET.SubElement(child, "D")
        d.set("value",str(density))
        d.set("unit",unit)
        a=ET.SubElement(child, "atom")
        a.set("value",atom)
        return child
    
    def AddSolid(self,sld_type,name,args):
        child=ET.SubElement(self.solids, sld_type)
        child.set("name",name)
        for item in args:
            child.set(item[0],str(item[1]))
        return child
    
    def AddVolume(self,name,material,solid):
        child=ET.SubElement(self.structure, "volume")
        child.set("name",name)
        mat=ET.SubElement(child, "materialref")
        mat.set("ref",material)
        sld=ET.SubElement(child, "solidref")
        sld.set("ref",solid)
        return child
        
    def AddPhysical(self,mother,volume,position,rotation=None):
        child=ET.SubElement(mother, "physvol")
        vol=ET.SubElement(child, "volumeref")
        vol.set("ref",volume)
        pos=ET.SubElement(child, "positionref")
        pos.set("ref",position)
        if rotation != None:
            rot=ET.SubElement(child, "rotationref")
            rot.set("ref",rotation)
        return child
    
    def AddSetup(self,name,ref):
        child=ET.SubElement(self.gdml, "setup")
        child.set("name",name)
        child.set("version","1.0")
        world=ET.SubElement(child,"world")
        world.set("ref",ref)
        return child


# In[ ]:




# In[446]:

class MacFile:
    def __init__(self):
        self.init=[]
        self.dist=[]
        self.mesh=[]
        self.run=[]
        self.output=[]
        self.primary=[]
    def Init(self,xname,phy_list):
        self.init.append("/GP/App/SetParameter app.phy_list %s" % phy_list)
        self.init.append("/persistency/gdml/read %s" % xname)
        self.init.append("/run/initialize")
    def Write(self,fname):
        fp=open(fname,'w')
        fp.write("#auto generate mac file. Do not modify it!!\n")
        fp.write("#Copyright: XU Chenghai!!\n")
        fp.write("#EMail: xuchenghai1984@163.com!!\n")
        fp.write("#Time: %s \n" % datetime.now())
        fp.write("\n")
        
        fp.write("#Init\n")
        for line in self.init:
            fp.write(line+"\n")
            
        fp.write("\n\n#Primary\n")
        for line in self.primary:
            fp.write(line+"\n")
            
        fp.write("\n\n#dist detector\n")
        for item in self.dist:
            for line in item:
                fp.write(line+"\n")
            fp.write("\n")
            
        fp.write("\n\n#mesh detector\n")
        for item in self.mesh:
            for line in item:
                fp.write(line+"\n")
            fp.write("\n")
            
        fp.write("\n\n#run\n")
        for line in self.run:
            fp.write(line+"\n")
            
        fp.write("\n\n#output\n")    
        for line in self.output:
            fp.write(line+"\n")
            
        fp.write("\n\n#end\n")    

        fp.close()

    def AddMeshDetector(self,name,size=(10,10,10,"cm"),pos=(0,0,10,"cm"),
                       rot=(0,0,0,"deg"),bins=(100,100,100)):
        """
        name: detector name
        size: detector size(x,y,z,unit)
        pos: detector position(x,y,z,unit)        
        rot: detector rotation(x,y,z,unit), unit must be deg.
        bins: detector bins(x,y,z) 
        """
        det=[]
        line="/score/create/boxMesh %s" % name
        det.append(line)
        #Be attention that the size for cmd score is half of the box
        line="/score/mesh/boxSize %s %s %s %s" %(size[0]/2,size[1]/2,size[2]/2,size[3])
        det.append(line)
        line="/score/mesh/translate/xyz %s %s %s %s" % (pos[0],pos[1],pos[2],pos[3])
        det.append(line)
        if rot !=None:
            line="/score/mesh/rotate/rotateX %s %s" % (rot[0],rot[3]) 
            det.append(line)
            line="/score/mesh/rotate/rotateY %s %s" % (rot[1],rot[3])
            det.append(line)
            line="/score/mesh/rotate/rotateZ %s %s" % (rot[2],rot[3])
            det.append(line)
        self.mesh.append(det)
        line="/score/mesh/nBin %s %s %s" % (bins[0],bins[1],bins[2])
        det.append(line)
        return det
      
    def AddMeshQuantity(self,det,dname,qtype,qname,qargs):
        """
        mesh detector
        det: detector
        dname: detector name
        qtype: quantity type
        qname: quantity name
        args: quantity argument list
        """
        line="/score/quantity/%s %s" % (qtype,qname)
        for item in qargs:
            line="%s %s" % (line,item)
        det.append(line)
        #/score/dumpQuantityToFile ct_body dose ct_body.dose.mesh 
        #comment since there are crash bug.
        #line="/score/dumpQuantityToFile %s %s %s.%s.mesh" % (dname, qname, dname, qname)
        #self.output.append(line)
        return det
        
    def AddMeshFilter(self,det,ftype,fname,fargs):
        line="/score/filter/%s %s" % (ftype,fname)
        for item in fargs:
            line="%s %s" % (line,item)
        det.append(line)
        return det
        
    def CloseMeshDetector(self,det):
        det.append("/score/close")
        return det
    
    def AddDistDetector(self,name):
        """
        dist detector .
        name: detector name, name must be a volume in mass world.
        """
        det=[]
        line="/GP/scorer/open %s" % name
        det.append(line)
        line="/GP/scorer/addSensDet G4MultiFunctionalDetector %s" % name
        det.append(line)
        self.dist.append(det)
        return det
    
    def AddDistQuantity(self,det,dname,qtype,qname,qargs):
        """
        det: detector
        dname: detector name
        qtype: quantity type
        qname: quantity name
        args: quantity argument list
        """
        line="/GP/scorer/addQuantity %s %s" % (qtype,qname)
        for item in qargs:
            line="%s %s" % (line,item)
        det.append(line)
        #/GP/scorer/save ct_in gammaErgDist ct_in.gamma.energy.dist
        line="/GP/scorer/save %s %s %s.%s.dist" % (dname,qname,dname,qname)
        self.output.append(line)
        return det
        
    def AddDistFilter(self,det,ftype,fname,fargs):
        line="/GP/scorer/addFilter %s %s" % (ftype,fname)
        for item in fargs:
            line="%s %s" % (line,item)
        det.append(line)
        return det
    
    def CloseDistDetector(self,det):
        det.append("/GP/scorer/close")
        return det
    


# In[447]:

quantity_map={}

def quantity_parameter(quantity):    
    return []

def trackLength_parameter(par):
    res=[]
    try:
        res.append(par["wflag"])
        res.append(par["kflag"])
        res.append(par["vflag"])
    except:
        res=[]
    return res

def passageCellCurrent_parameter(par):
    res=[]
    try:
        res.append(par["wflag"])
    except:
        res=[]
    return res

def passageTrackLength_parameter(par):
    res=[]
    try:
        res.append(par["wflag"])
    except:
        res=[]
    return res

def flatSurfaceCurrent_parameter(par):
    res=[]
    try:
        res.append(par["dflag"])
        res.append(par["wflag"])
        res.append(par["aflag"])
    except:
        res=[]
    return res

def flatSurfaceFlux_parameter(par):
    res=[]
    try:
        res.append(par["dflag"])
    except:
        res=[]
    return res

def nOfCollision_parameter(par):
    res=[]
    try:
        res.append(par["wflag"])
    except:
        res=[]
    return res

def population_parameter(par):
    res=[]
    try:
        res.append(par["wflag"])
    except:
        res=[]
    return res

def nOfTrack_parameter(par):
    res=[]
    try:
        res.append(par["dflag"])
        res.append(par["wflag"])
    except:
        res=[]
    return res

def nOfTerminatedTrack_parameter(par):
    res=[]
    try:
        res.append(par["wflag"])
    except:
        res=[]
    return res

def GPEnergyDistribution_parameter(par):
    res=[]
    try:
        res.append(par["direction"])
        res.append(par["bin_width"])
        res.append(par["unit"])
        
    except:
        res=[]
    return res

def GPPhaseScorer_parameter(par):
    res=[]
    try:
        res.append(par["direction"])
        res.append(par["kflag"])
        
    except:
        res=[]
    return res

quantity_map["quantity"]=quantity_parameter
quantity_map["trackLength"]=trackLength_parameter
quantity_map["passageCellCurrent"]=passageCellCurrent_parameter
quantity_map["passageTrackLength"]=passageTrackLength_parameter
quantity_map["flatSurfaceCurrent"]=flatSurfaceCurrent_parameter
quantity_map["flatSurfaceFlux"]=flatSurfaceFlux_parameter
quantity_map["nOfCollision"]=nOfCollision_parameter
quantity_map["population"]=population_parameter
quantity_map["nOfTrack"]=nOfTrack_parameter
quantity_map["nOfTerminatedTrack"]=nOfTerminatedTrack_parameter
quantity_map["GPEnergyDistribution"]=GPEnergyDistribution_parameter
quantity_map["GPPhaseScorer"]=GPPhaseScorer_parameter


# In[448]:

filter_map={}
def filter_parameter(par):
    return []
def kineticEnergy_parameter(par):
    res=[]
    try:
        res.append(par["elow"])
        res.append(par["ehigh"])
        res.append(par["unit"])
    except:
        res=[]
    return res
def particle_parameter(par):
    res=[]
    for item in par["list"]:
        res.append(item)
    return res
def particleWithKineticEnergy_parameter(par):
    res=[]
    try:
        res.append(par["elow"])
        res.append(par["ehigh"])
        res.append(par["unit"])
    except:
        res=[]
    for item in par["list"]:
        res.append(item)
    return res
filter_map["filter"]=filter_parameter
filter_map["kineticEnergy"]=kineticEnergy_parameter
filter_map["particle"]=particle_parameter
filter_map["particleWithKineticEnergy"]=particleWithKineticEnergy_parameter


# In[449]:

det_map={}
def DecodeQuantity(quantity):
    qtype=quantity["type"]
    qname=quantity["name"]
    qparameter=quantity["parameter"]
    ftype=quantity["filter"]["type"]
    fname=quantity["filter"]["name"]
    fparameter=quantity["filter"]["parameter"]
    qfun=None
    try:
        qfun=quantity_map[qtype]
    except:
        qfun=quantity_map["quantity"]
    qargs=qfun(qparameter)

    ffun=None
    try:
        ffun=filter_map[ftype]
    except:
        ffun=filter_map["filter"]
    fargs=ffun(fparameter)
    #print(qtype,qname,qargs)
    #print(ftype,fname,fargs)
    return qtype,qname,qargs,ftype,fname,fargs

def DetectorDist(mac,dname,solid,place,detector):
    quantities=detector["quantities"]
    if len(quantities) < 1:
        return
    det=mac.AddDistDetector(dname)
    for quantity in quantities:
        qtype,qname,qargs,ftype,fname,fargs=DecodeQuantity(quantity)
        mac.AddDistQuantity(det,dname,qtype,qname,qargs)
        if ftype !="--":
            mac.AddDistFilter(det,ftype,fname,fargs)
    det=mac.CloseDistDetector(det)
    return det

def DetectorMesh(mac,dname,solid,place,detector):
    quantities=detector["quantities"]
    if len(quantities) < 1:
        return
    spar=solid["parameter"]
    size=(spar["x"],spar["y"],spar["z"],spar["lunit"])
    ppar=place["position"]
    pos=(ppar["x"],ppar["y"],ppar["z"],ppar["lunit"])
    rpar=place["rotation"]
    rot=(rpar["x"],rpar["y"],rpar["z"],rpar["aunit"])
    dpar=detector["parameter"]
    bins=(dpar["x"],dpar["y"],dpar["z"])
    det=mac.AddMeshDetector(dname,size=size,pos=pos,
                       rot=rot,bins=bins)
    for quantity in quantities:
        qtype,qname,qargs,ftype,fname,fargs=DecodeQuantity(quantity)
        mac.AddMeshQuantity(det,dname,qtype,qname,qargs)
        if ftype !="--":
            mac.AddMeshFilter(det,ftype,fname,fargs)
    det=mac.CloseMeshDetector(det)
        
det_map["dist"]=DetectorDist
det_map["mesh"]=DetectorMesh


# In[478]:

class GPSSource:
    fun_map={}
    def __init__(self):
        self.fun_map["particle"]=self.DecodeParticle
        self.fun_map["position"]=self.DecodePosition
        self.fun_map["direction"]=self.DecodeDirection
        self.fun_map["energy"]=self.DecodeEnergy
        self.fun_map["time"]=self.DecodeTime
    def DecodeParticle(self,mac,particle):
        ptype=particle["type"]
        line="/gps/particle %s" % ptype
        if ptype=="ion":
            line = "%s %s %s %s %s" % (line,particle["z"],particle["a"],particle["q"],particle["e"])
            #line = "%s %s %s %s %s %s" % (line,particle["z"],particle["a"],particle["q"],particle["e"],particle["v"])
        mac.append(line)
    def DecodePosition(self,mac,position):
        #print(position)
        ptype=position["type"]
        centre=(position["centre"]["x"],position["centre"]["y"],position["centre"]["z"],position["lunit"])
        line="/gps/pos/type %s" % ptype
        mac.append(line)
        line="/gps/pos/centre %s %s %s %s" % centre
        mac.append(line)
        
        try:
            rot1=(position["rot1"]["x"],position["rot1"]["y"],position["rot1"]["z"])
            line="/gps/pos/rot1 %s %s %s" % rot1
            mac.append(line)
            rot2=(position["rot2"]["x"],position["rot2"]["y"],position["rot2"]["z"])
            line="/gps/pos/rot2 %s %s %s" % rot2
            mac.append(line)
        except:
            rot1=None
            rot2=None         

        try:
            shape=position["shape"]
            line="/gps/pos/shape %s " % shape
            mac.append(line)
        except:
            shape=None
            
        if ptype=="Plane":          
            if shape=="Circle":
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)
            elif shape=="Annulus":
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)
                line="/gps/pos/inner_radius %s %s " % (position["inner_radius"],position["lunit"])
                mac.append(line)
            elif shape=="Ellipse":
                line="/gps/pos/halfx %s %s " % (position["half"]["x"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfy %s %s " % (position["half"]["y"],position["lunit"])
                mac.append(line)
            elif shape=="Rectangle":
                line="/gps/pos/halfx %s %s " % (position["half"]["x"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfy %s %s " % (position["half"]["y"],position["lunit"])
                mac.append(line)
            else:
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)
                
        elif ptype=="Beam":          
            if shape=="Circle":
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)                
                line="/gps/pos/sigma_r %s %s " % (position["sigma_r"],position["lunit"])
                mac.append(line)  
                
            elif shape=="Ellipse":
                line="/gps/pos/sigma_x %s %s " % (position["sigma_y"],position["lunit"])
                mac.append(line)                
                line="/gps/pos/sigma_y %s %s " % (position["sigma_y"],position["lunit"])
                mac.append(line)  
                line="/gps/pos/halfx %s %s " % (position["half"]["x"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfy %s %s " % (position["half"]["y"],position["lunit"])
                mac.append(line)
            else:
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)                
                line="/gps/pos/sigma_r %s %s " % (position["sigma_r"],position["lunit"])
                mac.append(line) 
                
        elif ptype=="Surface":          
            if shape=="Sphere":
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)                
                
            elif shape=="Ellipsoid":
                line="/gps/pos/halfx %s %s " % (position["half"]["x"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfy %s %s " % (position["half"]["y"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfz %s %s " % (position["half"]["z"],position["lunit"])
                mac.append(line)
            elif shape=="Cylinder":
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfz %s %s " % (position["half"]["z"],position["lunit"])
                mac.append(line)
            elif shape=="Para":
                line="/gps/pos/halfx %s %s " % (position["half"]["x"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfy %s %s " % (position["half"]["y"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfz %s %s " % (position["half"]["z"],position["lunit"])
                mac.append(line)
                line="/gps/pos/paralp %s %s " % (position["alpha"],position["aunit"])
                mac.append(line)
                line="/gps/pos/parthe %s %s " % (position["theta"],position["aunit"])
                mac.append(line)
                line="/gps/pos/parphi %s %s " % (position["phi"],position["aunit"])
                mac.append(line)
            else:
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line) 
                
        elif ptype=="Volume":          
            if shape=="Sphere":
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)                
                line="/gps/pos/inner_radius %s %s " % (position["inner_radius"],position["lunit"])
                mac.append(line)                
                
            elif shape=="Ellipsoid":
                line="/gps/pos/halfx %s %s " % (position["half"]["x"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfy %s %s " % (position["half"]["y"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfz %s %s " % (position["half"]["z"],position["lunit"])
                mac.append(line)
            elif shape=="Cylinder":
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)
                line="/gps/pos/inner_radius %s %s " % (position["inner_radius"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfz %s %s " % (position["half"]["z"],position["lunit"])
                mac.append(line)
            elif shape=="Para":
                line="/gps/pos/halfx %s %s " % (position["half"]["x"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfy %s %s " % (position["half"]["y"],position["lunit"])
                mac.append(line)
                line="/gps/pos/halfz %s %s " % (position["half"]["z"],position["lunit"])
                mac.append(line)
                line="/gps/pos/paralp %s %s " % (position["alpha"],position["aunit"])
                mac.append(line)
                line="/gps/pos/parthe %s %s " % (position["theta"],position["aunit"])
                mac.append(line)
                line="/gps/pos/parphi %s %s " % (position["phi"],position["aunit"])
                mac.append(line)
            else:
                line="/gps/pos/radius %s %s " % (position["radius"],position["lunit"])
                mac.append(line)                
                line="/gps/pos/inner_radius %s %s " % (position["inner_radius"],position["lunit"])
                mac.append(line)                

                
    def DecodeDirection(self,mac,direction):
        dtype=direction["type"]
        line="/gps/ang/type %s" % dtype.lower()
        mac.append(line)
        try:
            rot1=(direction["rot1"]["x"],direction["rot1"]["y"],direction["rot1"]["z"],)
            line="/gps/ang/rot1 %s %s %s" % rot1
            mac.append(line)
            rot2=(direction["rot2"]["x"],direction["rot2"]["y"],direction["rot2"]["z"],)
            line="/gps/ang/rot2 %s %s %s" % rot2
            mac.append(line)
        except:
            rot1=None
            rot2=None

        if dtype=="Iso":
            line="/gps/ang/mintheta %s %s" % (direction["mintheta"],direction["aunit"])
            mac.append(line)
            line="/gps/ang/maxtheta %s %s" % (direction["maxtheta"],direction["aunit"])
            mac.append(line)
            line="/gps/ang/minphi %s %s" % (direction["minphi"],direction["aunit"])
            mac.append(line)
            line="/gps/ang/maxphi %s %s" % (direction["maxphi"],direction["aunit"])
            mac.append(line)
            line="/gps/ang/maxphi %s %s" % (direction["maxphi"],direction["aunit"])
            mac.append(line)

        elif dtype=="Cos":
            line="/gps/ang/mintheta %s %s" % (direction["mintheta"],direction["aunit"])
            mac.append(line)
            line="/gps/ang/maxtheta %s %s" % (direction["maxtheta"],direction["aunit"])
            mac.append(line)
            line="/gps/ang/minphi %s %s" % (direction["minphi"],direction["aunit"])
            mac.append(line)
            line="/gps/ang/maxphi %s %s" % (direction["maxphi"],direction["aunit"])
            mac.append(line)
            line="/gps/ang/maxphi %s %s" % (direction["maxphi"],direction["aunit"])
            mac.append(line)

        elif dtype=="Beam1d":
            line="/gps/ang/sigma_r %s %s" % (direction["sigma_r"],direction["aunit"])
            mac.append(line)

        elif dtype=="Beam2d":
            line="/gps/ang/sigma_x %s %s" % (direction["sigma_x"],direction["aunit"])
            mac.append(line)
            line="/gps/ang/sigma_y %s %s" % (direction["sigma_y"],direction["aunit"])
            mac.append(line)

        elif dtype=="Focused":
            line="/gps/ang/focuspoint %s %s %s %s" % (direction["focuspoint"]["x"],direction["focuspoint"]["z"],direction["focuspoint"]["y"],direction["lunit"])
            mac.append(line)

        elif dtype=="Planar":
            line="/gps/direction %s %s %s" % (direction["direction"]["x"],direction["direction"]["y"],direction["direction"]["z"],)
            mac.append(line)
    def DecodeEnergy(self,mac,energy):
        etype=energy["type"]
        line="/gps/ene/type %s" % etype
        mac.append(line)
        if etype=="Mono":
            line="/gps/ene/mono %s %s" % (energy["mono"],energy["eunit"])
            mac.append(line)
        elif etype=="Lin":
            line="/gps/ene/min %s %s" % (energy["min"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/max %s %s" % (energy["max"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/gradient %s %s" % (energy["gradient"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/intercept %s %s" % (energy["intercept"],energy["eunit"])
            mac.append(line)
        elif etype=="Pow":
            line="/gps/ene/min %s %s" % (energy["min"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/max %s %s" % (energy["max"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/alpha %s %s" % (energy["alpha"],energy["eunit"])
            mac.append(line)
        elif etype=="Exp":
            line="/gps/ene/min %s %s" % (energy["min"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/max %s %s" % (energy["max"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/ezero %s %s" % (energy["ezero"],energy["eunit"])
            mac.append(line)
        elif etype=="Gauss":
            line="/gps/ene/mono %s %s" % (energy["mono"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/sigma %s %s" % (energy["sigma"],energy["eunit"])
            mac.append(line)
        elif etype=="Brem":
            line="/gps/ene/min %s %s" % (energy["min"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/max %s %s" % (energy["max"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/temp %s %s" % (energy["temp"],energy["eunit"])
            mac.append(line)
        elif etype=="Bbody":
            line="/gps/ene/min %s %s" % (energy["min"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/max %s %s" % (energy["max"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/temp %s %s" % (energy["temp"],energy["eunit"])
            mac.append(line)
        elif etype=="Cdg":
            line="/gps/ene/min %s %s" % (energy["min"],energy["eunit"])
            mac.append(line)
            line="/gps/ene/max %s %s" % (energy["max"],energy["eunit"])
            mac.append(line)
    def DecodeTime(self,mac,time):
        line="/gps/time %s %s" % (time["time"],time["tunit"])
        mac.append(line)


# In[469]:



# In[470]:

class ProjectJSON:    
    def __init__(self,fname,beamOn=37000000000):
        self.geometry=None
        self.primary=None
        self.physics=None
        self.run=None
        self.materials=None
        self.mass_world=None
        self.parallel_world=None
        self.gdml=None
        self.mac=None
        self.instance=None
        self.nodes=None
        self.run_time=None
        self.physics_list=None
        self.beamOn=beamOn
        #fname="config.json"
        project=import_json(fname)        
        for item in project:
            if item['type']=='geometry':                
                self.geometry=item
            if item['type']=='primary':                
                self.primary=item
            if item['type']=='physics':                
                self.physics=item
            if item['type']=='run':                
                self.run=item
            if item['type']=='materials':                
                self.materials=item
        self.DecodeGeometry(self.geometry)
        
        self.mac=MacFile()
        self.gdml=GDML()
        self.AddDefaultMaterials(self.gdml)
        self.DecodeMaterials(self.materials)
        vname,pname,rname=self.DecodeVolume(self.mass_world)
        self.gdml.AddSetup("Default",vname)
        vname,pname,rname=self.DecodeParallel(self.parallel_world)
        #self.gdml.AddSetup("ParallelWorld",vname)
        gname=fname+".gdml"
        self.gdml.Write(gname)

        self.DecodePhysics(self.mac,self.physics)
        self.mac.Init(os.path.basename(gname),self.physics_list)
        self.DecodePrimary(self.mac,self.primary)
        self.DecodeRun(self.mac,self.run)
        self.mac.Write(fname+".mac")
        
    def AddDefaultMaterials(self,gdml):
        with open("%s/Elements.json" % config.data_root) as f:
            json_data=json.load(f)
            for item in json_data:
                if item["name"] != "":
                    gdml.AddElement(item["name"],item["formula"],item["Z"],item["atom"])
        with open("%s/Materials.json" % config.data_root) as f:
            json_data=json.load(f)
            for item in json_data:
                if item["name"] != "":
                    gdml.AddMaterialZ(item["name"],item["Z"],item["density"],item["atom"])

    def DecodePhysics(self,mac,physics):
        data=physics["data"]
        self.physics_list="%s%s" % (data["list"],data["em"])
        print(self.physics_list)

    def DecodeRun(self,mac,run):
        data=run["data"]
        self.instance=data["instance"]
        self.nodes=min([20,max([1,int(data["nodes"])])])
        time=data["time"]
        tunit=data["unit"]
        if tunit=="minute":
            time=int(time)/60
        self.run_time=max([float(time),0.166667])
        mac.run.append("/GP/App/SetParameter app.run_time %s" % time)
        mac.run.append("/run/printProgress 100000")
        mac.run.append("")
        mac.run.append("#job valide and summary")
        mac.run.append("/control/echo  ===Geometry test===")
        mac.run.append("/geometry/test/run")
        mac.run.append("/control/echo  ===Print materials===")
        mac.run.append("/material/g4/printMaterial")
        mac.run.append("/control/echo  ===Print particles===")
        mac.run.append("/particle/list")
        mac.run.append("/control/echo  ===Print processes===")
        mac.run.append("/process/list")
        mac.run.append("/control/echo  ===Print regions===")
        mac.run.append("/run/dumpRegion")
        mac.run.append("/control/echo  ===Print couples===")
        mac.run.append("/run/dumpCouples")
        mac.run.append("/control/echo  ===Print scores===")
        mac.run.append("/score/list")
        mac.run.append("/control/echo  ===Print primary source===")
        mac.run.append("/gps/source/list")
        mac.run.append("/control/echo  ===Run start===")
        mac.run.append("/run/beamOn %s" % self.beamOn)

    def DecodePrimary(self,mac,primary):
        source=primary["children"][0]
        gps=GPSSource()
        for item in source["children"]:
            try:
                fun=gps.fun_map[item["type"]]
            except:
                print("Invalid source: ",item["type"],item)
            fun(mac.primary,item["data"])

    def DecodeGeometry(self,geo):
        for item in geo['children']:
            if item['text'] == 'world':
                self.mass_world=item
            if item['text'] == 'parallel':
                self.parallel_world=item
                
    def DecodeSolid(self,ID, solid):
        sld_type=solid['type']
        pls=[]
        for k,v in solid['parameter'].items():
            pls.append((k,v))
        name=ID+"_sol"
        #print("Add solid:", name,sld_type, pls)
        self.gdml.AddSolid(sld_type,name,pls)
        return name
    
    def DecodePlacement(self,ID,place):
        if place==None:
            return None,None
        pos=place["position"]
        rot=place["rotation"]
        pname=ID+"_pos"
        rname=ID+"_rot"
        self.gdml.AddPosition(pname,pos["x"],pos["y"],pos["z"],pos["lunit"])
        self.gdml.AddRotation(rname,rot["x"],rot["y"],rot["z"],rot["aunit"])
        return pname,rname
    
    def DecodeMaterials(self,materials):
        #print(materials)
        materials=materials["children"]
        for item in materials:
            name=item["data"]["name"]
            density=item["data"]["density"]
            unit="g/cm3"
            try:
                unit=item["data"]["unit"]
            except:
                unit="g/cm3"               
            cmp_type=item["data"]["weight"]
            children=item["children"]

            cmps=[]
            for cmp in children:
                cmps.append((cmp["data"]["name"],cmp["data"]["weight"]))
            self.gdml.AddMaterial(name,density,unit,cmp_type,cmps)           
             
            
    def DecodeDetector(self,vname,solid,place,detector):
        if detector==None or place==None or solid==None:
            return
        dtype=detector["type"]
        fun=None
        try:
            fun=det_map[dtype]
        except:
            print("Invalid detector type")
        if fun != None:
            fun(self.mac,vname,solid,place,detector)

            
    def DecodeVolume(self,vol):
        ID=vol['id']
        text=vol['text']
        ntype=vol['type']
        data=vol['data']
        material=data['material']

        solid=data['solid']
        children=vol['children']
        sname=self.DecodeSolid(ID,solid)
        vname=ID+"_vol"

        cvnames=[]
        cpnames=[]
        crnames=[]
        for child in children:
            cvname,cpname,crname=self.DecodeVolume(child)
            cvnames.append(cvname)
            cpnames.append(cpname)
            crnames.append(crname)
            
        vol=self.gdml.AddVolume(vname,material,sname)      
        for i in range(len(cvnames)):
            self.gdml.AddPhysical(vol,cvnames[i],cpnames[i],crnames[i])
            
        detector=None
        try:
            detector=data['detector']
        except:
            detector=None 
            
        place=None
        try:
            place=data['placement']
        except:
            place=None
        pname,rname=self.DecodePlacement(ID,place)
        self.DecodeDetector(vname,solid,place,detector)
        return vname,pname,rname
        
    def DecodeParallel(self,vol):
        ID=vol['id']
        data=vol['data']
        solid=data['solid']
        children=vol['children']
        vname=ID+"_vol"
        for child in children:
            cvname,cpname,crname=self.DecodeParallel(child)           
        detector=None
        try:
            detector=data['detector']
        except:
            detector=None 
            
        place=None
        try:
            place=data['placement']
        except:
            place=None
        self.DecodeDetector(vname,solid,place,detector)
        return vname,None,None


# In[471]:

#prj_json=ProjectJSON("config.json")


# In[ ]:



