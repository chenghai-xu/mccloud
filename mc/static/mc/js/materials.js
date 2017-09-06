$(document).ready(function () {
});

function MaterialAdd(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'materials' && current.type != 'material')
        return;

    /*
    var node = NewPhysicalNode('physical');
    var res = instance.create_node(current,node);
    console.log('create physical: ' + res);
    */
} 

function MaterialDelete(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'material')
        return;

    var res = instance.delete_node(current);
    console.log('delete material: ' + res);
} 
