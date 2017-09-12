$(document).ready(function () {
 //MaterialDialogInit();
});

function MaterialAdd(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'materials')
        return;

    var node = NewMaterial('Vaccum');
    var res = instance.create_node(current,node);
    console.log('create material: ' + res);
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

/*
function MaterialEdit(){
    $( "#material-list" ).dialog("open");
} 

function MaterialDialogInit()
{
    $( "#material-list" ).dialog({
        autoOpen: false,
        height: 480,
        width: 600,
        modal: true,
        buttons: {
            OK: function() {
                console.log('Modify material');
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
    //$("#material-table" ).DataTable();


}

function MaterialAddRow()
{
    var tbody = $("#material-tbody");
    var id=0;
        tbody.append('<tr id='+id+'>' +
            '<td name=com>' + 'He' + '</td>' +
            '<td name=weight>' + '1' + '</td>' +
            '</tr>');
    $("#material-tbody td").dblclick(function () { 
        var OriginalContent = $(this).text(); 
        if($(this).attr('name')==='com')
        {
            $(this).html("<input type='text' value='" + OriginalContent + "' />"); 
        }
        else if($(this).attr('name')==='weight')
        {
            $(this).html("<input type='number' value='" + OriginalContent + "' />"); 
        }
        $(this).children().first().focus(); 
        $(this).children().first().keypress(function (e) { 
            if (e.which == 13) { 
                var newContent = $(this).val(); 
                $(this).parent().text(newContent); 
            } }); 
        $(this).children().first().blur(function(){ 
            $(this).parent().text(OriginalContent); 
        }); 
    });
}
*/
 
function MaterialAddComponent(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'material')
        return;

    var node = NewComponent('H',0);
    var res = instance.create_node(current,node);
    console.log('create component: ' + res);
} 
