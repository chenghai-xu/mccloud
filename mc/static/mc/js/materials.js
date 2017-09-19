$(document).ready(function () {
    //MaterialDialogInit();
    InputNameDialogInit();
});
var InputCallBack=null;

function SelectedMaterials(current)
{
    SelectedMaterial(current);
    if(current.type != 'materials')
        return;
    var property = $('#property-materials').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    $('#property-container').append(property);
}
function SelectedMaterialComponent(current)
{
    if(current.type != 'component' )
        return;
    var property = $('#property-component').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    $(property).find('input[name=name]').val(current.data.name);
    $(property).find('input[name=weight]').val(current.data.weight);
    $('#property-container').append(property);
}
function SelectedMaterial(current)
{
    SelectedMaterialComponent(current);
    if(current.type != 'material' )
        return;
    var property = $('#property-material').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    $(property).find('input[name=name]').val(current.data.name);
    $(property).find('input[name=density]').val(current.data.density);
    $(property).find('select[name=type]').val(current.data.type);
    $(property).find('select[name=weight]').val(current.data.weight);
    $('#property-container').append(property);
}
function MaterialAdd(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'materials')
        return;

    InputCallBack=CheckAndAddMaterial;
    $('#dialog-input-name').dialog('open');
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

function CheckMaterialName(name)
{
    return true;
}

function NewComponentNode(t,w){
    var node = NewNode(t,'component');
    node.data.weight=w;
    node.data.name=node.text;
    return node;
}

function NewMaterialNode(t, d=0){
    var node=NewNode(t,'material');
    node.data.type='element';
    node.data.weight='composite';
    node.data.name=node.text;
    node.data.density=d;
    return node;
}

function PackDefaultMaterial(node)
{
    var child=NewMaterialNode('Water',1.0);
    child.children.push(new NewComponentNode('ele_H',2));
    child.children.push(new NewComponentNode('ele_O',1));
    node.children.push(child);
    child=NewMaterialNode('Vaccum',0.000129);
    child.children.push(new NewComponentNode('ele_H',1));
    node.children.push(child);
    child=NewMaterialNode('Air',0.000129);
    child.children.push(new NewComponentNode('ele_O',0.21));
    child.children.push(new NewComponentNode('ele_N',0.79));
    node.children.push(child);
}

function NewMaterialsNode()
{
    var node=NewNode('Materials','materials');
    PackDefaultMaterial(node);
    return node;
}

function CheckAndAddMaterial(name)
{
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return false;
    var current=selects[0];
    if(current.type != 'materials')
        return false;
    if(!CheckMaterialName(name))
    {
        alert('Already exist the same material!');
        return false;
    }
    var node = NewMaterialNode(name);
    var res = instance.create_node(current,node);
    console.log('create material: ' + res);
    return true;
}

function InputNameDialogInit()
{
    $( "#dialog-input-name" ).dialog({
        autoOpen: false,
        height: 200,
        width: 200,
        modal: true,
        buttons: {
            OK: function() {
                var value= $( "#dialog-input-name input[name=name]").val();
                console.log('Input text: ', value);
                if(InputCallBack(value))
                    $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
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

    InputCallBack=CheckAndAddComponent;
    $('#dialog-input-name').dialog('open');
} 

function CheckAndAddComponent(name)
{
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return false;
    var current=selects[0];
    if(current.type != 'material')
        return false;
    if(!CheckComponentName(name,current))
    {
        alert('Already exist the same component!');
        return false;
    }
    var node = NewComponentNode(name,0);
    var res = instance.create_node(current,node);
    console.log('create component: ' + res);
    return true;
}

function CheckComponentName(name,current)
{
    return true;
}

function OnMaterialSubmit(form)
{
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'material')
        return;

    var name=$(form).find('input[name=name]').val();
    var type=$(form).find('select[name=type]').val();
    var density=$(form).find('input[name=density]').val();
    var weight=$(form).find('select[name=weight]').val();
    if(!CheckMaterialName(name))
    {
        alert('Already exist the same material!');
        return false;
    }
    current.data.name=name;
    current.data.type=type;
    current.data.density=density;
    current.data.weight=weight;
    instance.rename_node(current,name);
}

function MaterialDeleteComponent()
{
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'component')
        return;

    var res = instance.delete_node(current);
    console.log('delete component: ' + res);
}

function OnMaterialComponentSubmit(form)
{
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'component')
        return;

    var name=$(form).find('input[name=name]').val();
    var weight=$(form).find('input[name=weight]').val();
    var par = instance.get_node(current.parent);
    if(!CheckComponentName(name,par))
    {
        alert('Already exist the same material!');
        return false;
    }
    current.data.name=name;
    current.data.weight=weight;
    instance.rename_node(current,name);
}
