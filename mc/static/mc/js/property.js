$(document).ready(function () {
});

function PhysicalAdd(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.original.ntype != 'physical')
        return;

    var node = NewPhysicalNode('physical');
    var res = instance.create_node(current,node);
    console.log('create physical: ' + res);
} 

function PhysicalDelete(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.original.ntype != 'physical')
        return;

    var par = instance.get_node(instance.get_parent(current));
    if(par.original.ntype == 'geometry')
        return;

    var res = instance.delete_node(current);
    console.log('delete physical: ' + res);
} 
