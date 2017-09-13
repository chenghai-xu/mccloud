$(document).ready(function () {
});

function NewPosition(t)
{
    var node={type:t};
    node.lunit='cm';
    node.aunit='deg';
    return node;
}

function NewPositionPoint()
{
    var node = NewPosition('Point');
    node.centre={x:0,y:0,z:0};
    return node;
}

function NewPositionPlane(shape='Circle')
{
    var node = NewPosition('Plane');
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
    return node;
}

function NewPositionBeam(shape='Circle')
{
    var node = NewPosition('Beam');
    node.shape=shape;
    node.centre={x:0,y:0,z:0};
    node.rot1={x:1,y:0,z:0};
    node.rot2={x:0,y:1,z:0};
    if(shape==='Circle')
        node.sigma=1;
    else if(shape==='Ellipse')
        node.sigma={x:1,y:2};
    else
        node.sigma=1;

    return node;
}

function NewPositionSurface(shape='Sphere')
{
    var node = NewPosition('Surface');
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
    return node;
}

function NewPositionVolume(shape='Sphere')
{
    var node = NewPosition('Volume');
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
    return node;
}

function NewPositionNode(t){
    var node=NewNode(t,'position');
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
    InitPosition(property,current);
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
    InitPosition(form,current)
    console.log('Change position type to: ',selected);
} 

function InitPosition(form,current)
{
    console.log('Init position form');
}
