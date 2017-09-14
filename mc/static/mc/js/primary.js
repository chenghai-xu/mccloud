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
    else if(shape==='Square')
        node.half={x:1,y:1};
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
        node.sigma=1;
    else if(shape==='Ellipse')
        node.sigma={x:1,y:2};
    else
    {
        node.shape='Circle';
        node.sigma=1;
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
        node.angle={alpha:30,theta:45,phi:60};
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
        node.angle={alpha:30,theta:45,phi:60};
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
    if(shape==='Circle')
        $(form).find('#gps-pos-radius').removeClass('hidden');
    else if(shape==='Annulus')
    {
        $(form).find('#gps-pos-radius').removeClass('hidden');
        $(form).find('#gps-pos-inner-radius').removeClass('hidden');
    }
    else if(shape==='Ellipse')
        $(form).find('#gps-pos-half').removeClass('hidden');
    else if(shape==='Square')
        $(form).find('#gps-pos-half').removeClass('hidden');
    else if(shape==='Rectangle')
        $(form).find('#gps-pos-half').removeClass('hidden');

    var select= $(form).find('select[name=shape]');
    select.empty();
    select.append('<option> Circle </option>');
    select.append('<option> Annulus </option>');
    select.append('<option> Ellipse </option>');
    select.append('<option> Square </option>');
    select.append('<option> Rectangle </option>');
    select.val(shape);
}

function InitPositionBeamForm(form,current)
{
    $(form).find('#gps-pos-shape').removeClass('hidden');
    $(form).find('#gps-pos-rot1').removeClass('hidden');
    $(form).find('#gps-pos-rot2').removeClass('hidden');
    var shape=current.data.shape;
    if(shape==='Circle')
        $(form).find('#gps-pos-sigma-r').removeClass('hidden');
    else if(shape==='Ellipse')
    {
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
    if(shape==='Sphere')
        $(form).find('#gps-pos-radius').removeClass('hidden');
    else if(shape==='Ellipsoid')
    {
        $(form).find('#gps-pos-half').removeClass('hidden');
    }
    else if(shape==='Cylinder')
    {
        $(form).find('#gps-pos-half').removeClass('hidden');
        $(form).find('#gps-pos-radius').removeClass('hidden');
    }
    else if(shape==='Para')
    {
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
    if(shape==='Sphere')
    {
        $(form).find('#gps-pos-radius').removeClass('hidden');
        $(form).find('#gps-pos-inner-radius').removeClass('hidden');
    }
    else if(shape==='Ellipsoid')
    {
        $(form).find('#gps-pos-half').removeClass('hidden');
    }
    else if(shape==='Cylinder')
    {
        $(form).find('#gps-pos-half').removeClass('hidden');
        $(form).find('#gps-pos-radius').removeClass('hidden');
        $(form).find('#gps-pos-inner-radius').removeClass('hidden');
    }
    else if(shape==='Para')
    {
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
