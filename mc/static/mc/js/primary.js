$(document).ready(function () {
});

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
