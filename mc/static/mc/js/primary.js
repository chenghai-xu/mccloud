$(document).ready(function () {
});

function NewPositionBase(t)
{
    var node={type:t};
    node.lunit='cm';
    node.aunit='deg';
    return node;
}

function NewPositionPoint()
{
    var node = NewPositionBase('Point');
    node.centre={x:0,y:0,z:0};
    return node;
}

function NewPositionPlane(shape='Circle')
{
    var node = NewPositionBase('Plane');
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

function NewPositionBeam(shape='Circle')
{
    var node = NewPositionBase('Beam');
    node.shape=shape;
    node.centre={x:0,y:0,z:0};
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    if(shape==='Circle')
        node.sigma_r=1;
    else if(shape==='Ellipse')
    {
        node.sigma_x=1;
        node.sigma_y=2;
    }
    else
    {
        node.shape='Circle';
        node.sigma_r=1;
    }

    return node;
}

function NewPositionSurface(shape='Sphere')
{
    var node = NewPositionBase('Surface');
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

function NewPositionVolume(shape='Sphere')
{
    var node = NewPositionBase('Volume');
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
function NewPosition(type='Point',shape='Circle')
{
    if(type=='Point')
        return NewPositionPoint();
    else if(type=='Plane')
        return NewPositionPlane(shape);
    else if(type=='Beam')
        return NewPositionBeam(shape);
    else if(type=='Surface')
        return NewPositionSurface(shape);
    else if(type=='Volume')
        return NewPositionVolume(shape);
    return NewPositionPoint();
}

function NewPositionNode(t){
    var node=NewNode(t,'position');
    node.data=NewPosition();
    return node;
}

function NewDirectionNode(t){
    var node=NewNode(t,'direction');
    node.data=NewAngular();
    return node;
}

function NewEnergyNode(t){
    var node=NewNode(t,'energy');
    return node;
}

function NewParticleNode(t){
    var node=NewNode(t,'particle');
    return node;
}

function NewTimeNode(t){
    var node=NewNode(t,'time');
    return node;
}


function NewSourceNode(t){
    var node=NewNode(t,'source');
    node.children.push(NewParticleNode('Particle'));
    node.children.push(NewPositionNode('Position'));
    node.children.push(NewDirectionNode('Direction'));
    node.children.push(NewEnergyNode('Energy'));
    node.children.push(NewTimeNode('Time'));
    return node;
}

function PrimaryAdd()
{
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'primary')
        return;
    var node = NewSourceNode('Source');
    var res = instance.create_node(current,node);
    console.log('create source: ' + res);

}

function SelectedSource(current)
{
    SelectedParticle(current);
    SelectedPosition(current);
    SelectedDirection(current);
    SelectedEnergy(current);
    SelectedTime(current);
    if(current.type != 'source')
        return;

    var property = $('#property-source').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    InitPositionForm(property,current);
    $('#property-container').append(property);
}

function SelectedParticle(current)
{
    if(current.type != 'particle')
        return;
}

function SelectedPosition(current)
{
    if(current.type != 'position')
        return;
    var property = $('#property-position').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    InitPositionForm(property,current);
    $('#property-container').append(property);
}

function SelectedDirection(current)
{
    if(current.type != 'direction')
        return;
    var property = $('#property-angular').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    InitAngularForm(property,current);
    $('#property-container').append(property);
}

function SelectedEnergy(current)
{
    if(current.type != 'energy')
        return;
}

function SelectedTime(current)
{
    if(current.type != 'time')
        return;
}

function SelectedPrimary(current)
{
    SelectedSource(current);
    if(current.type != 'primary')
        return;

    var property = $('#property-primary').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    $('#property-container').append(property);
}

function ChangePositionType(sel){
    var selected=$(sel).val();
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'position')
        return;

    var form=$('#property-current');
    console.log('Change position type to: ',selected);
    current.data=NewPosition(selected);
    InitPositionForm(form,current);
} 

function ChangePositionShape(sel){
    var selected=$(sel).val();
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'position')
        return;

    var form=$('#property-current');
    console.log('Change position shape to: ',selected);
    current.data=NewPosition(current.data.type,selected);
    InitPositionForm(form,current);
} 

function InitPositionForm(form,current)
{
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
        InitPositionPointForm(form,current);
    if(current.data.type==='Plane')
        InitPositionPlaneForm(form,current);
    if(current.data.type==='Beam')
        InitPositionBeamForm(form,current);
    if(current.data.type==='Surface')
        InitPositionSurfaceForm(form,current);
    if(current.data.type==='Volume')
        InitPositionVolumeForm(form,current);
}

function InitPositionPointForm(form,current)
{
}

function InitPositionPlaneForm(form,current)
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

function InitPositionBeamForm(form,current)
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
    }
    else if(shape==='Ellipse')
    {
        $(form).find('input[name=sigma-x]').val(data.sigma_x);
        $(form).find('input[name=sigma-y]').val(data.sigma_y);
        $(form).find('#gps-pos-sigma-x').removeClass('hidden');
        $(form).find('#gps-pos-sigma-y').removeClass('hidden');
    }
    var select= $(form).find('select[name=shape]');
    select.empty();
    select.append('<option> Circle </option>');
    select.append('<option> Ellipse </option>');
    select.val(shape);
}

function InitPositionSurfaceForm(form,current)
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

function InitPositionVolumeForm(form,current)
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

function GetCurrentPosition()
{
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return false;
    var current=selects[0];
    if(current.type != 'position')
        return false;
    return current;
}

function PositionCentreChanged(elem)
{
    var current=GetCurrentPosition();
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

function PositionRot1Changed(elem)
{
    var current=GetCurrentPosition();
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

function PositionRot2Changed(elem)
{
    var current=GetCurrentPosition();
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

function PositionHalfChanged(elem)
{
    var current=GetCurrentPosition();
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

function PositionRadiusChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.radius=parseFloat(val);
}

function PositionInnerRadiusChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.inner_radius=parseFloat(val);
}

function PositionSigmaRChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_r=parseFloat(val);
}

function PositionSigmaXChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_x=parseFloat(val);
}

function PositionSigmaYChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_y=parseFloat(val);
}

function PositionParalpChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.alpha=parseFloat(val);
}

function PositionPartheChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.theta=parseFloat(val);
}

function PositionParphiChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.phi=parseFloat(val);
}

function PositionLUnitChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.lunit=val;
}

function PositionAUnitChanged(elem)
{
    var current=GetCurrentPosition();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.aunit=val;
}

function NewAngularBase(t)
{
    var node={type:t};
    node.lunit='cm';
    node.aunit='deg';
    return node;
}

function NewAngularIso()
{
    var node = NewAngularBase('Iso');
    node.mintheta=0;
    node.maxtheta=180;
    node.minphi=0;
    node.maxphi=360;
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    return node;
}

function NewAngularCos()
{
    var node = NewAngularBase('Cos');
    node.mintheta=0;
    node.maxtheta=90;
    node.minphi=0;
    node.maxphi=360;
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    return node;
}

function NewAngularBeam1d()
{
    var node = NewAngularBase('Beam1d');
    node.sigma_r=0;
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    return node;
}

function NewAngularBeam2d()
{
    var node = NewAngularBase('Beam2d');
    node.sigma_x=0;
    node.sigma_y=0;
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    return node;
}

function NewAngularFocused()
{
    var node = NewAngularBase('Focused');
    node.focuspoint={x:0,y:0,z:0};
    return node;
}

function NewAngularPlanar()
{
    var node = NewAngularBase('Planar');
    node.direction={x:0,y:0,z:1};
    return node;
}

function NewAngular(type)
{
    if(type=='Iso')
        return NewAngularIso();
    else if(type=='Cos')
        return NewAngularCos();
    else if(type=='Beam1d')
        return NewAngularBeam1d();
    else if(type=='Beam2d')
        return NewAngularBeam2d();
    else if(type=='Planar')
        return NewAngularPlanar();
    else if(type=='Focused')
        return NewAngularFocused();
    return NewAngularPlanar();
}

function InitAngularForm(form,current)
{
    console.log('Init angular form');
    $(form).find('div .input-group').addClass('hidden');
    var data=current.data;
    $(form).find('#gps-ang-type').removeClass('hidden');
    $(form).find('select[name=type]').val(data.type);
    if(current.data.type==='Planar')
    {
        InitAngularPlanarForm(form,current);
    }
    else if(current.data.type==='Focused')
    {
        InitAngularFocusedForm(form,current);
    }
    else if(current.data.type==='Iso' || current.data.type==='Cos')
    {
        InitAngularIsoForm(form,current);
    }
    else if(current.data.type==='Beam1d')
    {
        InitAngularBeam1dForm(form,current);
    }
    else if(current.data.type==='Beam2d')
    {
        InitAngularBeam2dForm(form,current);
    }
}

function InitAngularPlanarForm(form,current)
{
    var data=current.data;
    $(form).find('input[name=direction]').val(data.direction.x+', ' + data.direction.y+', ' +data.direction.z);
    $(form).find('#gps-ang-direction').removeClass('hidden');
}

function InitAngularFocusedForm(form,current)
{
    var data=current.data;
    $(form).find('select[name=lunit]').val(data.lunit);
    $(form).find('#gps-ang-lunit').removeClass('hidden');
    $(form).find('input[name=focuspoint]').val(data.focuspoint.x+', '+data.focuspoint.y+', '+data.focuspoint.z);
    $(form).find('#gps-ang-focuspoint').removeClass('hidden');
}

function InitAngularIsoForm(form,current)
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

function InitAngularBeam1dForm(form,current)
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

function InitAngularBeam2dForm(form,current)
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

function ChangeAngularType(sel){
    var selected=$(sel).val();
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'direction')
        return;

    var form=$('#property-current');
    console.log('Change position type to: ',selected);
    current.data=NewAngular(selected);
    InitAngularForm(form,current);
} 

function AngularDirectionChanged(elem)
{
    var current=GetCurrentAngular();
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

function AngularRot1Changed(elem)
{
    var current=GetCurrentAngular();
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

function AngularRot2Changed(elem)
{
    var current=GetCurrentAngular();
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

function AngularMinThetaChanged(elem)
{
    var current=GetCurrentAngular();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.mintheta=parseFloat(val);
}

function AngularMaxThetaChanged(elem)
{
    var current=GetCurrentAngular();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.maxtheta=parseFloat(val);
}

function AngularMinPhiChanged(elem)
{
    var current=GetCurrentAngular();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.minphi=parseFloat(val);
}

function AngularMaxPhiChanged(elem)
{
    var current=GetCurrentAngular();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.maxphi=parseFloat(val);
}

function AngularSigmaRChanged(elem)
{
    var current=GetCurrentAngular();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_r=parseFloat(val);
}

function AngularSigmaXChanged(elem)
{
    var current=GetCurrentAngular();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_x=parseFloat(val);
}

function AngularSigmaYChanged(elem)
{
    var current=GetCurrentAngular();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.sigma_y=parseFloat(val);
}

function AngularFocusPointChanged(elem)
{
    var current=GetCurrentAngular();
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

function AngularLUnitChanged(elem)
{
    var current=GetCurrentAngular();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.lunit=val;
}

function AngularAUnitChanged(elem)
{
    var current=GetCurrentAngular();
    if(!current)
        return;
    var val=$(elem).val().trim();
    current.data.aunit=val;
}

function GetCurrentAngular()
{
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return false;
    var current=selects[0];
    if(current.type != 'direction')
        return false;
    return current;
}

