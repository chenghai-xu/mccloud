$(document).ready(function () {
});

function ChangeVolumeName(form){
    var name=$(form).val();
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'physical')
        return;
    instance.rename_node(current,name);
} 
