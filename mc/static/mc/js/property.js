$(document).ready(function () {
   InitProperty(); 
});

function InitProperty(){
    $('#physical-add').click(PhysicalAdd);
    $('#physical-delete').click(PhysicalDelete);
} 

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

    var res = instance.delete_node(current);
    console.log('delete physical: ' + res);
} 
