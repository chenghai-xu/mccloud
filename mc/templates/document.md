
# Introduction

MCClouds is an online Geant4 tool for MONTE CARLO PARTICLE TRANSPORT in matter. MCClouds is based upon Geant4 and supplies some interactive GUI to help design your particle tracking model. The purpose of MCClouds is to build the geometry intuitively, avoid C/C++ coding, Geant4 environment configure and other tedious works thai dose not concern the physics.

## The Support Browser
Currently only the Chrome is fully test and works well. The IE dose not work anymore. Others is unkown but the trial is welcome. 

## Check your need 

They are different users with various needs for Geant4. MCClouds is not expected to meet everyone's need. Before start build your model please checkouk the following features wether this tool can meet your requirement.

### What the MCClouds can do
* Build Geant4 geometry interactively with the 3D view.
* Create materials as you need.
* Configure the Geant4 built-in scores.
* Choose the Geant4 built-in physics model.
* Configure the primary generator by using Geant4 built-in GPS.
* Verify your mode with free.
* Run your model in a cluster with hundreds of CPU cores.
* View the result online, check the output log.
* Download the whole project after run.


### What the MCClouds can not do
* Only part of solid type are support. Please check [here](#chapter_geo) for detail.
* Only Geant4 built-in scorer and some few scorer are support. Please check [here](#chapter_sd) for detail.
* The Geant4 built-in material are not support.
* The user defined physics process are not support. Please check [here](#chapter_phy) for detail.
* The cut and region can not be configured currently.
* Only GPS primary generator are support currently. Please check [here](#chapter_pri) for detail.
* Verify model is free but run mode need pay.

## The MCClouds Project & Editor

A MCClouds project is a Geant4 project too. A complete MCClouds project is composed by the following part.

* Geometry: Build geometry model servers as input for Geant4, the scorers are included here.
* Material: Define the materials used by the geometry logical volume.  
* Physics: Define what physics processes will be simulated in Geant4. 
* Primary: Define the primary particle source  
* Run: Tool to verify the project and the run setup.
* Output: Area to show the run result.

The following figure shows an expanded project tree. 
![Project Tree](/static/mc/img/project_tree.PNG)


The MCClouds tool is located at [here](/mc). In this page except the top menu bar, there are three pane.

* The left pane is used to show the project. It is a tree structure, composed by a whole project setup. Click a tree node and its property will show in middle pane. A triangle shown before a node means that this node has some children node, click the triangle to expand this node.

* The middle is the property pane. It is used to show and edit the project setup.

* The right pane show the 3D view or console log. In the 3D view you can use mouse to pickup a geometry, then change its properties.


## Create your first project step by step<A Name="step_by_step"/>
Before to create a project, please register an acount by your email. After activate your email please open the tool [page](/mc)

* In the left pane click the button: "Project->New", a new project will create for you with name MyProject. A geometry is created as world, the physics and primary generator is confgured with default value.

* Expand the node MyProject (Click the triangle before the node MyProject).

* Expand the node Geometry (Click the triangle before the node Geometry).

* Click the node world. 

* In the middle pane the property about the world volume is shown. You can edit it and view the change immediately.

* In the middle pane, Click "Action->Add Child". A box with random position is inserted. 

* Pickup this child by mouse in 3D view or expand and select from the node world.

* Now you can edit the child property in middle pane. Give it a different name, target for example.

* Click the paralle node under Geometry. 

* In the middle pane change the paralle world size what you want.

* In the middle pane click "Action->Add Child". A sensitive detetor is inserted in paralle world. 

* Pickup this detector, change it size and position the same as the geometry target.

* In the middle pane, click "Action->Edit" Detector. 

* In the popup dialog, change the mesh setup as you need, add quantity what you want, give them specific name.

* Left the Physics node as default.

* Left the Primary node as default.

* Do not forget save your setup.

* Click Run node. 

* Click Verify in the middle pane, wait a moment for complete. Then check the console log and trajectory view.

* If there is no problem, choose your cluster setup(include node size, node type and run time) and click run. 

* After pay the order fee the task will run in a cluster. Just play around while its running.

* When your task finished, expand the Output node, click update to retrieve the result.

* Expand the children of Output node to view the results

* Download the whole task as you need.


## Build the Geometry<A Name="chapter_geo"/>

Currently only the following CSD solid types are supported:

Box, Tube, Sphere, Cone

Currently the parameterised placement is not supported.

There are two types of geometry in Geant4: the mass geometry and the paralle geometry.
The mass geometry is in real world that particle will interact with its matter.
The paralle geometry is in virtual world and is transparent to particle. The particle can not see the world and will not interact with its matter. The paralle geometry is used to score your interest quantity. 

Only one mass world shoud be defined while the paralle worlds number is not limited. 
The geometry can not overlap in mass world. 

When active a volume. The node and model in 3D view will be highlight. You can change its property value in the middle pane: 
* Action->Add Child: Add a child in this volume.
* Action->Delete Current: Delete current volume.
* Action->Edit Detector: Edit the sensitive detector. Please checkout [here](#chapter_sd)
* Name: The name of this volume
* Solid: Click to change the solid parameters or select a different solid type.
* Material: Select the material fill in this volume.
* Placement: Click to view and edit the position and rotation of current volume in its mother volume. Currently the parameterised placement is not support

![Volume Property](/static/mc/img/volume_property.PNG) ![Placement Property](/static/mc/img/placement_property.PNG)


## Configure the Sensitive Detector<A Name="chapter_sd"/>

** Notice: Please read the following content and its links some times to know what they are! **

To record your interest quantities in particle tracking. You need setup sensitive detector with various scorer. MCClouds supports two types of scorer:
### Geant4 built-in scoring mesh 
The please look into the following links for detail info about this scoring:
[Command-based scoring](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/ForApplicationDeveloper/BackupVersions/V10.2/html/ch04s08.html)
[Interactive scoring commands](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/ForApplicationDeveloper/html/AllResources/Control/UIcommands/_score_.html)

This scoring mesh is used to record the quantity distribution in 3D space. The users need to define the box size and the number of grids at X, Y and Z axis. The output is a 3D matrix.

This type of scorers are built in paralle geometry. This means that you need to build paralle geometry firstly. The volume material is not necessary. But please config the box size and its placement as you want.

After activate a paralle geometry volume, click "Action->Edit Detector" then the mesh setup will popup.
![Geant4 Scoring Mesh](/static/mc/img/g4_scoring.PNG)

Please edit the propery as you need:
* SD type: There is only one option mesh(Geant4 built-in mesh)
* Name: The SD name, keep it default is OK.
* Bins: The grids at X, Y, and Z axis. For example the value "10,20,40" will mesh the box by 10 grids at X axis, 20 grids at Y axis and 40 grids at Z axis. The total grids are 6000. Be attention that they are three intergers and separated by comma. Do not forget the comma! 

#### Quantity Table 
The below area are Quantity table, you can click "Add Quantity" or "Reomve Quantity" to add or reomve the highlight one. Click column "Quantity Type" to choose which you need. Give a proper and unique name to you quantity. 

The quantity type and its parameter can be found [here](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/ForApplicationDeveloper/BackupVersions/V10.2/html/AllResources/Control/UIcommands/_score_quantity_.html). Change the parameter value as you need but please keep the format unchanged. 

The filter type and its parameter can be found [here](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/ForApplicationDeveloper/BackupVersions/V10.2/html/AllResources/Control/UIcommands/_score_filter_.html). Choose one as you need, give it a proper and unique name too. Also, change the parameter value as you want but keep the format.


### Dist Scorer 

Except the Geant4 built-in scoring mesh there is a different scorer. This scorer is attached to mass geometry, so you need not config paralle geometry. To Setup this type of Scorer, activate the target mass geometry which you want. Click "Action->Edit Detector" then the setup dialog will popup. Here is an exmaple:
![](/static/mc/img/dist_scorer.PNG)

They are only two properties:

* SD type: Please select option "dist"
* Name: The SD name, keep it default is OK.

#### Quantity Table 

The below area are Quantity table, you can click "Add Quantity" or "Reomve Quantity" to add or reomve the highlight one. Click column "Quantity Type" to choose which you need. Give a proper and unique name to you quantity. 
There are only two types of quantity:
* GPEnergyDistribution: Record the particles energy spectrum when they cross the geometry boundary. The parameters are:
 
> direction: The value 1 means record the particles when they enter into this volume; The value 2 record the particles when they exit out of this volume; The value 0 means record all the particles that cross this volume boundary.

> bin_width: The spectrum precision

> unit: The unit for bin_width

* GPPhaseScorer: Collect the partices when they cross the geometry boundary. The parameters are:

> direction: The same as GPEnergyDistribution.The value 1 means record the particles when they enter into this volume; The value 2 record   the particles when they exit out of this volume; The value 0 means record all the particles that cross this volume boundary.

> kflag: Whether to kill this particle when it is recorded. This is used to reduce cpu comsumption if this particle is out of interest area.

> GPPhaseScorer will write particles info into files. Each particle contain the following info: PDG, postion, direction, and total energy. 

** Notice: The total count of record is limited to 1 million. **

The filter setup is same as Geant4 built-in scoring mesh.


## Choose the Physics<A Name="chapter_phy"/> 

** Notice: The user defined physics processes are not support and the user's selection is limited! **

** Notice: Please read the following content and its links some times to find whether it can meet your require! **

MCClouds uses Geant4 built-in Reference Physics Lists to configre the physics process. The detail info about Reference Physics Lists is at this [page](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/PhysicsListGuide/html/index.html). Here is just a simple summary. MCClouds strictly follows convention of Geant4 Reference Physics Lists with no extention.

Click the node Physics under your project tree then the middle pane will show the physic property.
![Physics](/static/mc/img/g4_physics_list.PNG)
* Physics Lists: Physics List options. Please check this [link](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/PhysicsListGuide/html/index.html) for explanation. Infact I did not concerns this too much.
* EM Option: The electromagnetic physics process you want to configue. STD means G4EmStandardPhysics and for the other option you can find here a detail [document](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/PhysicsListGuide/html/electromagnetic/emphyslist.html#em-constructors).

The others physics document can be found [here](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/ForApplicationDeveloper/BackupVersions/V10.2/html/ch05s02.html)

## Configure the Primary generator<A Name="chapter_pri"/>

** Notice: Currently only Geant4 General Particle Source is support **

** Notice: The primary source position can not be placed outside of the mass world geometry! **

To activate the primary source please expand the node "Primary->Source" in your project tree. It strictly follows the convention of Geant4 General Particle Source. Before you config it please read the Geant4's official [document](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/ForApplicationDeveloper/BackupVersions/V10.2/html/ch02s07.html). It is a little hard to understand but you can edit and very the model, then it will show the particle trajectory. This can give you an intuitive view.

![GPS Primary](/static/mc/img/primary_gps.PNG)

### Particle Type
Click node Particle to activate its property pane. You can select different type of particle:
gamma, e-, e+, neutron, proton, ion
![GPS Primary Particle](/static/mc/img/primary_gps_particle.PNG)

Here is ion source:
* Z: Atomic Number
* A: Atomic Mass
* Q: Charge of Ion (in unit of e)
* E: Excitation energy (in keV)
![GPS Primary Particle](/static/mc/img/primary_gps_particle_ion.PNG)

### Position
![GPS Primary Postion](/static/mc/img/primary_gps_position.PNG)

GPS supply lots of position type:

>Point, Beam, Plane, Surface and Volume. The default is Point.

Different type needs different parameter please read the Geant4 [link](http://geant4-userdoc.web.cern.ch/geant4-userdoc/UsersGuides/ForApplicationDeveloper/BackupVersions/V10.2/html/ch02s07.html) for detail info.

### Direction
The same as position, the direction has different type and various parameter. Please read the above link for your need.
![GPS Primary Direction](/static/mc/img/primary_gps_direction.PNG)

### Energy
The same as position too, the energy has different type and various parameter. Please read the above link for your need.
![GPS Primary Energy](/static/mc/img/primary_gps_energy.PNG)

### Time
Change as you need. It has no distribution.
![GPS Primary Time](/static/mc/img/primary_gps_time.PNG)

## Create the Materials<A Name="material_setup"/>
** Notice: The Geant4 built-in materials are not support! **

** Notice: The material( including elements ) name must be unique! **

MCClouds supply one hundred elements. You can build your material as you need. MCClouds build some materials too. Choose what you want.
When create a new project, expand the node Materials and its child. Here is a figure:
![Materials](/static/mc/img/materials.PNG)

Click "Action->System Materials" and "Action->System Elements" to view system default materials and elements.
![Materials](/static/mc/img/materials_system_materials.PNG)
![Elements](/static/mc/img/materials_system_elements.PNG)

Click "Action->Add Material" to add a new material. Input a unique name for it.

![Add Material](/static/mc/img/materials_add.PNG)

Activate the material you add. Its property will show in middle pane.
* Action->Add Component: Add a component to this material.
* Action->Delete Current: Delete current material.
* Name: The name of the material.
* Density(g/cm3): The matrial density in g/cm3.
* Type: The options are mixture and element. The option mixture means this material is composed by other materials. The option element means this material is composed by elements.
* Mix by: The options are composite and fraction. The option composite means the weight of the components is by quantity. For example a molecule of water consists of two atoms of hydrogen and one atom of oxygen. The option fraction means the weight of the components is by mass. For example the water consits of hydrogen by mass weight 0.1118 and oxygen by mass weight 0.8882.

** Change the material type will clean all its components. Change the property "Mix by" may invade the component setup. Be careful **

![Material](/static/mc/img/material.PNG)


Click "Action->Add Component" to add a new component. MCCloud will popup the available components for your selection, materials or elements which depends on your material type.
![Material](/static/mc/img/material_add_component.PNG)

Activate the component you just add. The following show its property:
* Name: The component name.
* Weight: The weight of this component. 

> Depends on the material's  property "Mix by". If the value of "Mix by" is composite the component weight must be a interger large or equal to 1. If the value of "Mix by" is fraction the component weight must be less or equal to 1.0. It is better that this material's components weight is summarized up to 1.0

![Material](/static/mc/img/material_component.PNG)


## Verify  and Run the Project<A Name="verify_run"/>

Now it is ready to verify and run you project. Activate it by click the node Run in project tree.
![Run](/static/mc/img/run.PNG)

### Verify
Without setup the cluster you can verify you project. Just click button Verify and wait some seconds. If no problem a message will show you the verify is finished. The message can not figure out all the potential problems. So please checkout the console log carefully, it contains lots of info printed by Geant4 kernel. It includes geometry, material, physics process, particle and sensitive detector setup. You can check the particle trajectory in 3D view. It is a good way to verify your source and geometry setup.

![Run](/static/mc/img/run_verify.PNG)

### Run

Configure you cluster firstly.
* Node Type: The node type. Currently there are 4 types:

> 4Core, 8Core, 16Core, 36Core.

> 4Core has 4 cpu cores per node, 8Core has 8 cpu cores, 16Cores has 16 cpu cores and 36Core has 36 cpu cores.

> The node cpu config is Intel(R) Xeon(R) CPU E5-2666 v3 @ 2.90GHz

* Node Size: The node counts you need. You'd better set its value less than 20 since the MPI communication may fail.
* Run Time: How long you want your job to run.
* Time Unit: The unit of Run Time

Click button Run to submit your order. The order will popup with the item and cost. Click button "Pay & Run" to pay and submit your job. Certainly you need to charge some money before this step. 

![Run](/static/mc/img/run_run.PNG)

![Run](/static/mc/img/need_charge.PNG)

After pay the fee your job will run automatically. A progress bar will popup. Since the cluster will need some minutes to boot to load your project. Please wait be patient or do some thing else. Or you can close this progress bar and check the output after some time.

![Run](/static/mc/img/job_start.PNG)

## View the Result<A Name="view_output"/>
** Notice: To view the result please update the job by first. **

Expand the node Output in project tree. You can update the current job. When the status becomes DONE that means your job is done and now it's time to view the result. 
![Run](/static/mc/img/output.PNG)

Or you can open the past job or download the job files.
![Job](/static/mc/img/job_list.PNG)

### Mesh
You can view mesh in X, Y or Z direction
* Quantiy File: The quantity file to view.
* Axis: Which axis cut to view.
* Index: The cut index to view. The range should be less than the mesh bin value, where you configue the Geant4 built-in scoring mesh, see [page](#chapter_sd) 
![Job](/static/mc/img/mesh_control.PNG)
![Job](/static/mc/img/mesh_z_view.PNG)

### Dist
You can view quantity distribution
* Quantiy File: The quantity file to view.
* Line Style: Line stype for the plot.
* Color: The color for the plot
![Job](/static/mc/img/dist_control.PNG)
![dist](/static/mc/img/dist_view.PNG)

### Log
Here you can view the log file detailly. Choose whant you want. Here is a part of the log.  

```
============Begin of Run: 0==============

Run ID: 0
Current Time: 2018-04-11 05:09:25
Events to be processed:2147483647
===The current generator: G4GeneralParticleSource.===
============Sensitive detector list==============
/
/j1_27_vol   *** Active 
/j1_28_vol   *** Active 
--> Event 0 starts.
--> Event 100000 starts.
--> Event 200000 starts.
We already reach run time limit with 1 minutes, run time limit: 0.166667 hours, run time: 0.166667 hours
GPEventAction: Abort run.
Write scorer from G4VScoringMesh: j1_28_vol/targetErgDep., size: 109779, sum: 5.53952e+06
Save G4VScoringMesh: j1_28_vol/targetErgDep.
GPHitsMap, the time spent on G4VScoringMeshSave(): 0.031414 seconds.
The rank 1/4( master ) merge GPTHitsMap to 0/4.
GPHitsMap, the time spent on G4VScoringMeshMergeV1(): 0.031462 seconds.
Pack GPHitsHandle: j1_27_vol/quantity.1343
Pack GPHitsHandle: j1_27_vol/quantity.1255
The rank 1/4( master ) send vector GPHitsHandle to 0/4, size: 262
Send finish.
GPScorerManager, the time spent on MergeSend: 7.1e-05 seconds.
GPScorerManager, total time spent on merge: 0.031579 seconds.

===================End of Run: 0=====================
Run ID: 0
Current Time: 2018-04-11 05:19:45
Time cost: 0:9:58
Events processed:209695
Total particles tracked: 7195816
Total steps tracked: 120566213
Omit save command since we are not the master
Omit save command since we are not the master
```

## The Output Format<A Name="output_format"/>
You can download the jos to your local desktop for deep study, here is the file format you need to know.
#### Mesh File  
The mesh file end with the postfix ".mesh". It contain the quantity distribution in 3D space. The file content can be read by the python code:

```
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
    def GetZSection(self,z):
        return self.Data[int(z),:,:]
    def GetYSection(self,y):
        return self.Data[:,int(y),:]
    def GetXSection(self,x):
        return self.Data[:,:,int(x)]
```

#### Dist File  
The dist file end with the postfix ".dist". It contain the particle's quantity distribution (energy spectrum for example) when cross a geometry boundary. The file content can be read by the python code: 

```
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

```

#### Phase File 
The phase file end with the postfix ".phase". It contain a bunch of particle's property when cross the geometry boundary. The file content can be read by the the following python. Call GPPhaseReader::Next() to get one particle.  

```
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
```

