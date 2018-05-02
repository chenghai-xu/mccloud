$(document).ready(function () {
        NodeWatch.Add('primary', '#property-primary',PrimaryControl);
        NodeWatch.Add('particle', '#property-particle',PParticle);
        NodeWatch.Add('position', '#property-position',PositionControl);
        NodeWatch.Add('direction', '#property-angular',DirectionControl);
        NodeWatch.Add('energy','#property-energy',PEnergy);
        NodeWatch.Add('time','#property-time',PTime);
});
var PrimaryControl={current: null, form: null};
var PositionControl={current: null, form: null};
var DirectionControl={current: null, form: null};

var PrimaryModel={};
var DirectionModel={};
var PositionModel={};
PositionModel.NewPositionBase=function(t)
{
    var node={type:t};
    node.lunit='cm';
    node.aunit='deg';
    return node;
}

PositionModel.NewPositionPoint=function()
{
    var node = this.NewPositionBase('Point');
    node.centre={x:0,y:0,z:0};
    return node;
}

PositionModel.NewPositionPlane=function(shape='Circle')
{
    var node = this.NewPositionBase('Plane');
    node.shape=shape;
    node.centre={x:0,y:0,z:0};
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    if(shape==='Circle')
        node.radius=1;
    else if(shape==='Annulus')
    {
        node.radius=2;
        node.inner_radius=1;
    }
    else if(shape==='Ellipse')
        node.half={x:1,y:2};
    else if(shape==='Rectangle')
        node.half={x:1,y:2};
    else
    {
        node.shape='Circle';
        node.radius=1;
    }

    return node;
}

PositionModel.NewPositionBeam=function(shape='Circle')
{
    var node = this.NewPositionBase('Beam');
    node.shape=shape;
    node.centre={x:0,y:0,z:0};
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    if(shape==='Circle')
    {
        node.radius=1;
        node.sigma_r=1;
    }
    else if(shape==='Ellipse')
    {
        node.sigma_x=1;
        node.sigma_y=2;
        node.half={x:1,y:2};
    }
    else
    {
        node.shape='Circle';
        node.radius=1;
        node.sigma_r=1;
    }

    return node;
}

PositionModel.NewPositionSurface=function(shape='Sphere')
{
    var node = this.NewPositionBase('Surface');
    node.shape=shape;
    node.centre={x:0,y:0,z:0};
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    if(shape==='Sphere')
    {
        node.radius=1;
    }
    else if(shape==='Ellipsoid')
    {
        node.half={x:1,y:2,z:3};
    }
    else if(shape==='Cylinder')
    {
        node.radius=2;
        node.half={z:1};
    }
    else if(shape==='Para')
    {
        node.alpha=30;
        node.theta=45;
        node.phi=60;
        node.half={x:1,y:2,z:3};
    }
    else
    {
        node.radius=1;
        node.shape='Sphere';
    }
    return node;
}

PositionModel.NewPositionVolume=function(shape='Sphere')
{
    var node = this.NewPositionBase('Volume');
    node.shape=shape;
    node.centre={x:0,y:0,z:0};
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    if(shape==='Sphere')
    {
        node.radius=2;
        node.inner_radius=1;
    }
    else if(shape==='Ellipsoid')
    {
        node.half={x:1,y:2,z:3};
    }
    else if(shape==='Cylinder')
    {
        node.radius=2;
        node.inner_radius=1;
        node.half={z:1};
    }
    else if(shape==='Para')
    {
        node.alpha=30;
        node.theta=45;
        node.phi=60;
        node.half={x:1,y:2,z:3};
    }
    else
    {
        node.radius=2;
        node.inner_radius=1;
        node.shape='Sphere';
    }
    return node;
}
PositionModel.NewPosition=function(type='Point',shape='Circle')
{
    if(type=='Point')
        return this.NewPositionPoint();
    else if(type=='Plane')
        return this.NewPositionPlane(shape);
    else if(type=='Beam')
        return this.NewPositionBeam(shape);
    else if(type=='Surface')
        return this.NewPositionSurface(shape);
    else if(type=='Volume')
        return this.NewPositionVolume(shape);
    return this.NewPositionPoint();
}

PrimaryModel.NewPositionNode=function(t){
    var node=NewNode(t,'position');
    node.data=PositionModel.NewPosition();
    return node;
}

PrimaryModel.NewDirectionNode=function(t){
    var node=NewNode(t,'direction');
    node.data=DirectionModel.NewAngular();
    return node;
}

PrimaryModel.NewEnergyNode=function(t){
    var node=NewNode(t,'energy');
    node.data=PEnergy.New();
    return node;
}

PrimaryModel.NewParticleNode=function(t){
    var node=NewNode(t,'particle');
    node.data=PParticle.New();
    return node;
}

PrimaryModel.NewTimeNode=function(t){
    var node=NewNode(t,'time');
    node.data=PTime.New();
    return node;
}


PrimaryModel.NewSourceNode=function(t){
    var node=NewNode(t,'source');
    node.children.push(this.NewParticleNode('Particle'));
    node.children.push(this.NewPositionNode('Position'));
    node.children.push(this.NewDirectionNode('Direction'));
    node.children.push(this.NewEnergyNode('Energy'));
    node.children.push(this.NewTimeNode('Time'));
    return node;
}

function NewPrimaryNode()
{
    var node=NewNode('Primary','primary');
    node.children.push(PrimaryModel.NewSourceNode('Source'));
    return node;
}

PrimaryControl.Add=function()
{
    var instance = $('#project-view').jstree(true);
    var node = PrimaryModel.NewSourceNode('Source');
    var res = instance.create_node(this.current,node);
    console.log('create source: ' + res);
}
PrimaryControl.Init=function()
{
};

PositionControl.ChangePositionType=function(sel){
    var selected=$(sel).val();
    var form=this.form;
    var current=this.current;
    console.log('Change position type to: ',selected);
    current.data=PositionModel.NewPosition(selected);
    this.Init();
} 

PositionControl.ChangePositionShape=function(sel){
    var selected=$(sel).val();
    var form=this.form;
    var current=this.current;
    console.log('Change position shape to: ',selected);
    current.data=PositionModel.NewPosition(current.data.type,selected);
    this.Init();
} 

PositionControl.Init=function()
{
    var form=this.form;
    var current=this.current;
    console.log('Init position form');
    $(form).find('div .input-group').addClass('hidden');
    $(form).find('#gps-pos-type').removeClass('hidden');
    $(form).find('#gps-pos-centre').removeClass('hidden');
    $(form).find('#gps-pos-lunit').removeClass('hidden');
    $(form).find('#gps-pos-aunit').removeClass('hidden');
    var data=current.data;
    $(form).find('select[name=type]').val(data.type);
    $(form).find('select[name=lunit]').val(data.lunit);
    $(form).find('select[name=aunit]').val(data.aunit);
    $(form).find('input[name=centre]').val(data.centre.x+', '+data.centre.y+', '+data.centre.z);

    if(current.data.type==='Point')
        this.InitPositionPointForm(form,current);
    if(current.data.type==='Plane')
        this.InitPositionPlaneForm(form,current);
    if(current.data.type==='Beam')
        this.InitPositionBeamForm(form,current);
    if(current.data.type==='Surface')
        this.InitPositionSurfaceForm(form,current);
    if(current.data.type==='Volume')
        this.InitPositionVolumeForm(form,current);
}

PositionControl.InitPositionPointForm=function(form,current)
{
}

PositionControl.InitPositionPlaneForm=function(form,current)
{
    $(form).find('#gps-pos-shape').removeClass('hidden');
    $(form).find('#gps-pos-rot1').removeClass('hidden');
    $(form).find('#gps-pos-rot2').removeClass('hidden');
    var shape=current.data.shape;
    var data=current.data;
    $(form).find('input[name=rot1]').val(data.rot1.x+', ' + data.rot1.y + ', ' + data.rot1.z);
    $(form).find('input[name=rot2]').val(data.rot2.x+', ' + data.rot2.y + ', ' + data.rot2.z);
    if(shape==='Circle')
    {
        $(form).find('input[name=radius]').val(data.radius);
        $(form).find('#gps-pos-radius').removeClass('hidden');
    }
    else if(shape==='Annulus')
    {
        $(form).find('input[name=radius]').val(data.radius);
        $(form).find('input[name=inner-radius]').val(data.inner_radius);
        $(form).find('#gps-pos-radius').removeClass('hidden');
        $(form).find('#gps-pos-inner-radius').removeClass('hidden');
    }
    else if(shape==='Ellipse')
    {
        $(form).find('input[name=half]').val(data.half.x+', '+data.half.y);
        $(form).find('span[id=halfxyz]').html('Half XY(x,y):');
        $(form).find('#gps-pos-half').removeClass('hidden');
    }
    else if(shape==='Rectangle')
    {
        $(form).find('span[id=halfxyz]').html('Half XY(x,y):');
        $(form).find('input[name=half]').val(data.half.x+', '+data.half.y);
        $(form).find('#gps-pos-half').removeClass('hidden');
    }

    var select= $(form).find('select[name=shape]');
    select.empty();
    select.append('<option> Circle </option>');
    select.append('<option> Annulus </option>');
    select.append('<option> Ellipse </option>');
    select.append('<option> Rectangle </option>');
    select.val(shape);
}

PositionControl.InitPositionBeamForm=function(form,current)
{
    $(form).find('#gps-pos-shape').removeClass('hidden');
    $(form).find('#gps-pos-rot1').removeClass('hidden');
    $(form).find('#gps-pos-rot2').removeClass('hidden');
    var shape=current.data.shape;
    var data=current.data;
    $(form).find('input[name=rot1]').val(data.rot1.x+', ' + data.rot1.y + ', ' + data.rot1.z);
    $(form).find('input[name=rot2]').val(data.rot2.x+', ' + data.rot2.y + ', ' + data.rot2.z);
    if(shape==='Circle')
    {
        $(form).find('input[name=sigma-radius]').val(data.sigma_r);
        $(form).find('#gps-pos-sigma-radius').removeClass('hidden');
        $(form).find('input[name=radius]').val(data.radius);
        $(form).find('#gps-pos-radius').removeClass('hidden');
    }
    else if(shape==='Ellipse')
    {
        $(form).find('input[name=sigma-x]').val(data.sigma_x);
        $(form).find('input[name=sigma-y]').val(data.sigma_y);
        $(form).find('#gps-pos-sigma-x').removeClass('hidden');
        $(form).find('#gps-pos-sigma-y').removeClass('hidden');

        $(form).find('input[name=half]').val(data.half.x+', '+data.half.y);
        $(form).find('span[id=halfxyz]').html('Half XY(x,y):');
        $(form).find('#gps-pos-half').removeClass('hidden');
    }
    var select= $(form).find('select[name=shape]');
    select.empty();
    select.append('<option> Circle </option>');
    select.append('<option> Ellipse </option>');
    select.val(shape);
}

PositionControl.InitPositionSurfaceForm=function(form,current)
{
    $(form).find('#gps-pos-shape').removeClass('hidden');
    $(form).find('#gps-pos-rot1').removeClass('hidden');
    $(form).find('#gps-pos-rot2').removeClass('hidden');
    var shape=current.data.shape;
    var data=current.data;
    $(form).find('input[name=rot1]').val(data.rot1.x+', ' + data.rot1.y + ', ' + data.rot1.z);
    $(form).find('input[name=rot2]').val(data.rot2.x+', ' + data.rot2.y + ', ' + data.rot2.z);
    if(shape==='Sphere')
    {
        $(form).find('input[name=radius]').val(data.radius);
        $(form).find('#gps-pos-radius').removeClass('hidden');
    }
    else if(shape==='Ellipsoid')
    {
        $(form).find('span[id=halfxyz]').html('Half XYZ(x,y,z):');
        $(form).find('input[name=half]').val(data.half.x+', '+data.half.y+', '+data.half.z);
        $(form).find('#gps-pos-half').removeClass('hidden');
    }
    else if(shape==='Cylinder')
    {
        $(form).find('input[name=radius]').val(data.radius);
        $(form).find('span[id=halfxyz]').html('Half Z:');
        $(form).find('input[name=half]').val(data.half.z);
        $(form).find('#gps-pos-half').removeClass('hidden');
        $(form).find('#gps-pos-radius').removeClass('hidden');
    }
    else if(shape==='Para')
    {
        $(form).find('span[id=halfxyz]').html('Half XYZ(x,y,z):');
        $(form).find('input[name=half]').val(data.half.x+', '+data.half.y+', '+data.half.z);
        $(form).find('input[name=paralp]').val(data.alpha);
        $(form).find('input[name=parthe]').val(data.theta);
        $(form).find('input[name=parphi]').val(data.phi);
        $(form).find('#gps-pos-half').removeClass('hidden');
        $(form).find('#gps-pos-paralp').removeClass('hidden');
        $(form).find('#gps-pos-parthe').removeClass('hidden');
        $(form).find('#gps-pos-parphi').removeClass('hidden');
    }
    var select= $(form).find('select[name=shape]');
    select.empty();
    select.append('<option> Sphere </option>');
    select.append('<option> Ellipsoid </option>');
    select.append('<option> Cylinder </option>');
    select.append('<option> Para </option>');
    select.val(shape);
}

PositionControl.InitPositionVolumeForm=function(form,current)
{
    $(form).find('#gps-pos-shape').removeClass('hidden');
    $(form).find('#gps-pos-rot1').removeClass('hidden');
    $(form).find('#gps-pos-rot2').removeClass('hidden');
    var shape=current.data.shape;
    var data=current.data;
    $(form).find('input[name=rot1]').val(data.rot1.x+', ' + data.rot1.y + ', ' + data.rot1.z);
    $(form).find('input[name=rot2]').val(data.rot2.x+', ' + data.rot2.y + ', ' + data.rot2.z);
    if(shape==='Sphere')
    {
        $(form).find('input[name=radius]').val(data.radius);
        $(form).find('input[name=inner-radius]').val(data.inner_radius);
        $(form).find('#gps-pos-radius').removeClass('hidden');
        $(form).find('#gps-pos-inner-radius').removeClass('hidden');
    }
    else if(shape==='Ellipsoid')
    {
        $(form).find('span[id=halfxyz]').html('Half XYZ(x,y,z):');
        $(form).find('input[name=half]').val(data.half.x+', '+data.half.y+', '+data.half.z);
        $(form).find('#gps-pos-half').removeClass('hidden');
    }
    else if(shape==='Cylinder')
    {
        $(form).find('input[name=radius]').val(data.radius);
        $(form).find('input[name=inner-radius]').val(data.inner_radius);
        $(form).find('span[id=halfxyz]').html('Half Z:');
        $(form).find('input[name=half]').val(data.half.z);
        $(form).find('#gps-pos-half').removeClass('hidden');
        $(form).find('#gps-pos-radius').removeClass('hidden');
        $(form).find('#gps-pos-inner-radius').removeClass('hidden');
    }
    else if(shape==='Para')
    {
        $(form).find('span[id=halfxyz]').html('Half XYZ(x,y,z):');
        $(form).find('input[name=half]').val(data.half.x+', '+data.half.y+', '+data.half.z);
        $(form).find('input[name=paralp]').val(data.alpha);
        $(form).find('input[name=parthe]').val(data.theta);
        $(form).find('input[name=parphi]').val(data.phi);
        $(form).find('#gps-pos-half').removeClass('hidden');
        $(form).find('#gps-pos-paralp').removeClass('hidden');
        $(form).find('#gps-pos-parthe').removeClass('hidden');
        $(form).find('#gps-pos-parphi').removeClass('hidden');
    }
    var select= $(form).find('select[name=shape]');
    select.empty();
    select.append('<option> Sphere </option>');
    select.append('<option> Ellipsoid </option>');
    select.append('<option> Cylinder </option>');
    select.append('<option> Para </option>');
    select.val(shape);
}

PositionControl.PositionCentreChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    var val = val.split(",");
    if(val.length!=3)
    {
        alert('Invalid Centre value, valid format:\nx,y,z');
    }
    if(val[2]==='')
    {
        alert('Invalid Centre value, valid format:\nx,y,z');
    }
    current.data.centre.x=parseFloat(val[0]);
    current.data.centre.y=parseFloat(val[1]);
    current.data.centre.z=parseFloat(val[2]);
}

PositionControl.PositionRot1Changed=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    if(current.data.type==='Point')
        return;
    var val=$(elem).val().trim();
    var val = val.split(",");
    if(val.length!=3)
    {
        alert('Invalid rotaion value, valid format:\nx,y,z');
    }
    if(val[2]==='')
    {
        alert('Invalid rotaion value, valid format:\nx,y,z');
    }
    current.data.rot1.x=parseFloat(val[0]);
    current.data.rot1.y=parseFloat(val[1]);
    current.data.rot1.z=parseFloat(val[2]);
}

PositionControl.PositionRot2Changed=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    if(current.data.type==='Point')
        return;
    var val=$(elem).val().trim();
    var val = val.split(",");
    if(val.length!=3)
    {
        alert('Invalid rotaion value, valid format:\nx,y,z');
    }
    if(val[2]==='')
    {
        alert('Invalid rotaion value, valid format:\nx,y,z');
    }
    current.data.rot2.x=parseFloat(val[0]);
    current.data.rot2.y=parseFloat(val[1]);
    current.data.rot2.z=parseFloat(val[2]);
}

PositionControl.PositionHalfChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    if(current.data.type==='Point')
        return;
    var shape=current.data.shape;
    var val=$(elem).val().trim();
    if(shape==='Cylinder')
        current.data.half.z=parseFloat(val);
    var val = val.split(",");
    if(shape==='Ellipse' || shape==='Rectangle')
    {
        if(val.length!=2)
        {
            alert('Invalid half value, valid format:\nx,y');
        }
        if(val[1]==='')
        {
            alert('Invalid half value, valid format:\nx,y');
        }
        current.data.half.x=parseFloat(val[0]);
        current.data.half.y=parseFloat(val[1]);
    }
    else if(shape==='Ellipsoid' || shape==='Para')
    {
        if(val.length!=3)
        {
            alert('Invalid half value, valid format:\nx,y,z');
        }
        if(val[2]==='')
        {
            alert('Invalid half value, valid format:\nx,y,z');
        }
        current.data.half.x=parseFloat(val[0]);
        current.data.half.y=parseFloat(val[1]);
        current.data.half.z=parseFloat(val[2]);
    }
}

PositionControl.PositionRadiusChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.radius=parseFloat(val);
}

PositionControl.PositionInnerRadiusChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.inner_radius=parseFloat(val);
}

PositionControl.PositionSigmaRChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_r=parseFloat(val);
}

PositionControl.PositionSigmaXChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_x=parseFloat(val);
}

PositionControl.PositionSigmaYChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_y=parseFloat(val);
}

PositionControl.PositionParalpChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.alpha=parseFloat(val);
}

PositionControl.PositionPartheChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.theta=parseFloat(val);
}

PositionControl.PositionParphiChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.phi=parseFloat(val);
}

PositionControl.PositionLUnitChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.lunit=val;
}

PositionControl.PositionAUnitChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.aunit=val;
}

DirectionModel.NewAngularBase=function(t)
{
    var node={type:t};
    node.lunit='cm';
    node.aunit='deg';
    return node;
}

DirectionModel.NewAngularIso=function()
{
    var node = this.NewAngularBase('Iso');
    node.mintheta=0;
    node.maxtheta=180;
    node.minphi=0;
    node.maxphi=360;
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    return node;
}

DirectionModel.NewAngularCos=function()
{
    var node = this.NewAngularBase('Cos');
    node.mintheta=0;
    node.maxtheta=90;
    node.minphi=0;
    node.maxphi=360;
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    return node;
}

DirectionModel.NewAngularBeam1d=function()
{
    var node = this.NewAngularBase('Beam1d');
    node.sigma_r=0;
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    return node;
}

DirectionModel.NewAngularBeam2d=function()
{
    var node = this.NewAngularBase('Beam2d');
    node.sigma_x=0;
    node.sigma_y=0;
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    return node;
}

DirectionModel.NewAngularFocused=function()
{
    var node = this.NewAngularBase('Focused');
    node.focuspoint={x:0,y:0,z:0};
    return node;
}

DirectionModel.NewAngularPlanar=function()
{
    var node = this.NewAngularBase('Planar');
    node.direction={x:0,y:0,z:1};
    return node;
}

DirectionModel.NewAngular=function(type)
{
    if(type=='Iso')
        return this.NewAngularIso();
    else if(type=='Cos')
        return this.NewAngularCos();
    else if(type=='Beam1d')
        return this.NewAngularBeam1d();
    else if(type=='Beam2d')
        return this.NewAngularBeam2d();
    else if(type=='Planar')
        return this.NewAngularPlanar();
    else if(type=='Focused')
        return this.NewAngularFocused();
    return this.NewAngularIso();
}

DirectionControl.Init=function()
{
    var form=this.form;
    var current=this.current;

    console.log('Init angular form');
    $(form).find('div .input-group').addClass('hidden');
    var data=current.data;
    $(form).find('#gps-ang-type').removeClass('hidden');
    $(form).find('select[name=type]').val(data.type);
    if(current.data.type==='Planar')
    {
        this.InitAngularPlanarForm(form,current);
    }
    else if(current.data.type==='Focused')
    {
        this.InitAngularFocusedForm(form,current);
    }
    else if(current.data.type==='Iso' || current.data.type==='Cos')
    {
        this.InitAngularIsoForm(form,current);
    }
    else if(current.data.type==='Beam1d')
    {
        this.InitAngularBeam1dForm(form,current);
    }
    else if(current.data.type==='Beam2d')
    {
        this.InitAngularBeam2dForm(form,current);
    }
}

DirectionControl.InitAngularPlanarForm=function(form,current)
{
    var data=current.data;
    $(form).find('input[name=direction]').val(data.direction.x+', ' + data.direction.y+', ' +data.direction.z);
    $(form).find('#gps-ang-direction').removeClass('hidden');
}

DirectionControl.InitAngularFocusedForm=function(form,current)
{
    var data=current.data;
    $(form).find('select[name=lunit]').val(data.lunit);
    $(form).find('#gps-ang-lunit').removeClass('hidden');
    $(form).find('input[name=focuspoint]').val(data.focuspoint.x+', '+data.focuspoint.y+', '+data.focuspoint.z);
    $(form).find('#gps-ang-focuspoint').removeClass('hidden');
}

DirectionControl.InitAngularIsoForm=function(form,current)
{
    var data=current.data;
    $(form).find('select[name=aunit]').val(data.aunit);
    $(form).find('#gps-ang-aunit').removeClass('hidden');

    $(form).find('#gps-ang-rot1').removeClass('hidden');
    $(form).find('input[name=rot1]').val(data.rot1.x+', ' + data.rot1.y + ', ' + data.rot1.z);
    $(form).find('#gps-ang-rot2').removeClass('hidden');
    $(form).find('input[name=rot2]').val(data.rot2.x+', ' + data.rot2.y + ', ' + data.rot2.z);

    $(form).find('#gps-ang-mintheta').removeClass('hidden');
    $(form).find('input[name=mintheta]').val(data.mintheta);

    $(form).find('#gps-ang-maxtheta').removeClass('hidden');
    $(form).find('input[name=maxtheta]').val(data.maxtheta);

    $(form).find('#gps-ang-minphi').removeClass('hidden');
    $(form).find('input[name=minphi]').val(data.minphi);

    $(form).find('#gps-ang-maxphi').removeClass('hidden');
    $(form).find('input[name=maxphi]').val(data.maxphi);
}

DirectionControl.InitAngularBeam1dForm=function(form,current)
{
    var data=current.data;
    $(form).find('select[name=aunit]').val(data.aunit);
    $(form).find('#gps-ang-aunit').removeClass('hidden');

    $(form).find('#gps-ang-rot1').removeClass('hidden');
    $(form).find('input[name=rot1]').val(data.rot1.x+', ' + data.rot1.y + ', ' + data.rot1.z);
    $(form).find('#gps-ang-rot2').removeClass('hidden');
    $(form).find('input[name=rot2]').val(data.rot2.x+', ' + data.rot2.y + ', ' + data.rot2.z);

    $(form).find('#gps-ang-sigma-radius').removeClass('hidden');
    $(form).find('input[name=sigma-radius]').val(data.sigma_r);
}

DirectionControl.InitAngularBeam2dForm=function(form,current)
{
    var data=current.data;
    $(form).find('select[name=aunit]').val(data.aunit);
    $(form).find('#gps-ang-aunit').removeClass('hidden');

    $(form).find('#gps-ang-rot1').removeClass('hidden');
    $(form).find('input[name=rot1]').val(data.rot1.x+', ' + data.rot1.y + ', ' + data.rot1.z);
    $(form).find('#gps-ang-rot2').removeClass('hidden');
    $(form).find('input[name=rot2]').val(data.rot2.x+', ' + data.rot2.y + ', ' + data.rot2.z);

    $(form).find('#gps-ang-sigma-x').removeClass('hidden');
    $(form).find('input[name=sigma-x]').val(data.sigma_x);

    $(form).find('#gps-ang-sigma-y').removeClass('hidden');
    $(form).find('input[name=sigma-y]').val(data.sigma_y);
}

DirectionControl.ChangeAngularType=function(sel){
    var selected=$(sel).val();
    var current=this.current;
    console.log('Change position type to: ',selected);
    current.data=DirectionModel.NewAngular(selected);
    this.Init();
} 

DirectionControl.AngularDirectionChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    var val = val.split(",");
    if(val.length!=3)
    {
        alert('Invalid direction value, valid format:\nx,y,z');
    }
    if(val[2]==='')
    {
        alert('Invalid direction value, valid format:\nx,y,z');
    }
    current.data.direction.x=parseFloat(val[0]);
    current.data.direction.y=parseFloat(val[1]);
    current.data.direction.z=parseFloat(val[2]);
}

DirectionControl.AngularRot1Changed=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    var val = val.split(",");
    if(val.length!=3)
    {
        alert('Invalid rotation value, valid format:\nx,y,z');
    }
    if(val[2]==='')
    {
        alert('Invalid rotation value, valid format:\nx,y,z');
    }
    current.data.rot1.x=parseFloat(val[0]);
    current.data.rot1.y=parseFloat(val[1]);
    current.data.rot1.z=parseFloat(val[2]);
}

DirectionControl.AngularRot2Changed=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    var val = val.split(",");
    if(val.length!=3)
    {
        alert('Invalid rotation value, valid format:\nx,y,z');
    }
    if(val[2]==='')
    {
        alert('Invalid rotation value, valid format:\nx,y,z');
    }
    current.data.rot2.x=parseFloat(val[0]);
    current.data.rot2.y=parseFloat(val[1]);
    current.data.rot2.z=parseFloat(val[2]);
}

DirectionControl.AngularMinThetaChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.mintheta=parseFloat(val);
}

DirectionControl.AngularMaxThetaChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.maxtheta=parseFloat(val);
}

DirectionControl.AngularMinPhiChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.minphi=parseFloat(val);
}

DirectionControl.AngularMaxPhiChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.maxphi=parseFloat(val);
}

DirectionControl.AngularSigmaRChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_r=parseFloat(val);
}

DirectionControl.AngularSigmaXChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_x=parseFloat(val);
}

DirectionControl.AngularSigmaYChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_y=parseFloat(val);
}

DirectionControl.AngularFocusPointChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    var val = val.split(",");
    if(val.length!=3)
    {
        alert('Invalid position value, valid format:\nx,y,z');
    }
    if(val[2]==='')
    {
        alert('Invalid position value, valid format:\nx,y,z');
    }
    current.data.focuspoint.x=parseFloat(val[0]);
    current.data.focuspoint.y=parseFloat(val[1]);
    current.data.focuspoint.z=parseFloat(val[2]);
}

DirectionControl.AngularLUnitChanged=function(elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.lunit=val;
}

DirectionControl.AngularAUnitChanged=function (elem)
{
    var current=this.current;
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.aunit=val;
}

var PEnergy = {
    TypeMap: new Map([
        ['Mono',{type:'Mono',mono:1.0}],
        ['Lin',{type:'Lin',min:1.0,max:2.0,gradient:0,intercept:0}],
        ['Pow',{type:'Pow',min:1.0,max:2.0,alpha:0}],
        ['Exp',{type:'Exp',min:1.0,max:2.0,ezero:0}],
        ['Gauss',{type:'Gauss',mono:1.0,sigma:0}],
        ['Brem',{type:'Brem',min:1.0,max:2.0,temp:0}],
        ['Bbody',{type:'Bbody',min:1.0,max:2.0,temp:0}],
        ['Cdg',{type:'Cdg',min:1.0,max:2.0}],
    ]), 

    New: function(t='Mono'){
        var node=this.TypeMap.get(t);
        if(!node)
            node=this.TypeMap.get('Mono');
        node.eunit='MeV';
        return node;
    },

    Init: function()
    {
        var form=this.form;
        var current=this.current;
        $(form).find('div .input-group').addClass('hidden');
        $(form).find('#gps-ene-type').removeClass('hidden');
        $(form).find('#gps-ene-eunit').removeClass('hidden');
        var data=current.data;
        $(form).find('select[name=type]').val(data.type);
        $(form).find('select[name=eunit]').val(data.eunit);
        for(p in data)
        {
            if(p==='type' || p === 'eunit')
                continue;
            $(form).find('#gps-ene-'+p).removeClass('hidden');
            $(form).find('input[name='+p+']').val(data[p]);
        }
    },

    TypeChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'energy')
            return;

        var form=$('#property-current');
        console.log('Change energy type to: ',value);
        current.data=this.New(value);
        this.Init();
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'energy')
            return;
        var p=$(elem).attr('name');
        console.log('Change energy parameter '+p+' to '+ value);
        if(p==='eunit')
            current.data[p]=value;
        else
            current.data[p]=parseFloat(value);

    },
}
var PParticle = {
    TypeMap: new Map([
        ['gamma',{type:'gamma'}],
        ['e-',{type:'e-'}],
        ['e+',{type:'e+'}],
        ['neutron',{type:'neutron'}],
        ['proton',{type:'proton'}],
        ['ion',{type:'ion',z:1,a:1,q:0,e:0,v:-1}],
    ]), 

    New: function(t='gamma'){
        var node=this.TypeMap.get(t);
        if(!node)
            node=this.TypeMap.get('gamma');
        return node;
    },

    Init: function()
    {
        var form=this.form;
        var current=this.current;
        $(form).find('div .input-group').addClass('hidden');
        $(form).find('#gps-par-type').removeClass('hidden');
        var data=current.data;
        $(form).find('select[name=type]').val(data.type);
        for(p in data)
        {
            if(p==='type')
                continue;
            $(form).find('#gps-par-'+p).removeClass('hidden');
            $(form).find('input[name='+p+']').val(data[p]);
        }
    },

    TypeChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'particle')
            return;

        var form=$('#property-current');
        console.log('Change particle type to: ',value);
        current.data=this.New(value);
        this.Init();
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'particle')
            return;
        var p=$(elem).attr('name');
        console.log('Change particle parameter '+p+' to '+ value);
        current.data[p]=parseFloat(value);

    },
}
var PTime = {
    New: function(){
        var node={time:0,tunit:'ns'};
        return node;
    },

    Init: function()
    {
        var form=this.form;
        var current=this.current;
        $(form).find('div .input-group').addClass('hidden');
        $(form).find('#gps-time-tunit').removeClass('hidden');
        var data=current.data;
        $(form).find('select[name=tunit]').val(data.tunit);
        for(p in data)
        {
            if(p==='tunit')
                continue;
            $(form).find('#gps-time-'+p).removeClass('hidden');
            $(form).find('input[name='+p+']').val(data[p]);
        }
    },

    TUnitChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'time')
            return;

        var form=$('#property-current');
        console.log('Change time unit to: ',value);
        current.data.tunit=value;
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'time')
            return;
        var p=$(elem).attr('name');
        console.log('Change time parameter '+p+' to '+ value);
        current.data[p]=parseFloat(value);

    },
}
