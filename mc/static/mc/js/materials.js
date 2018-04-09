$(document).ready(function () {
    //MaterialDialogInit();
    InputNameDialogInit();
    InputSelectDialogInit();
    MaterialsControl.GetDefaultMaterial();
    NodeWatch.Add('materials','#property-materials',MaterialsControl);
    NodeWatch.Add('material','#property-material',MaterialControl);
    NodeWatch.Add('component','#property-component',ComponentControl);
    MaterialsControl.InitSystemMaterialsListDlg();
    MaterialsControl.InitSystemElementsListDlg();
});

var MaterialsModel={};
var MaterialsControl={};

var ComponentControl={};
var MaterialControl={};

var InputCBObject=null;
MaterialsControl.GetDefaultMaterial=function()
{
    $.get({ 
        url: "/mc/material/", 
        data:{},
        success: function(data){
            //console.log(data);
            mat=JSON.parse(data);
            MaterialsModel.Elements=mat.Elements;
            MaterialsModel.Materials=mat.Materials;
            mat=null;
        },
    });
};

MaterialsControl.GetAllMaterials=function()
{
    var instance = $('#project-view').jstree(true);
    var res=[];
    if(!this.current)
        return res;

    for(let id of this.current.children)
    {
        var n=instance.get_node(id);
        res.push(n.data.name);
    }
    return res;
};


MaterialsControl.Init=function()
{
};

ComponentControl.Init=function()
{
    var property=this.form;
    var current=this.current;
    $(property).find('input[name=name]').val(current.data.name);
    $(property).find('input[name=weight]').val(current.data.weight);

    var instance = $('#project-view').jstree(true);
    var par=instance.get_node(current.parent);
    if(!par)
        return;
    var type = par.data.weight;
    if(type ==='fraction')
    {
        $(property).find('input[name=weight]').attr('max',1.0);
        $(property).find('input[name=weight]').attr('min',0.0);
        $(property).find('input[name=weight]').attr('step',0.001);
    }
    else if(type ==='composite')
    {
        $(property).find('input[name=weight]').attr('max',1000);
        $(property).find('input[name=weight]').attr('min',1);
        $(property).find('input[name=weight]').attr('step',1);
    }
};

MaterialControl.Init=function()
{
    var property=this.form;
    var current=this.current;
    $(property).find('input[name=name]').val(current.data.name);
    $(property).find('input[name=density]').val(current.data.density);
    $(property).find('select[name=type]').val(current.data.type);
    $(property).find('select[name=weight]').val(current.data.weight);
}

MaterialsControl.Add=function(){
    InputCBObject=MaterialsControl;
    $('#dialog-input-name').dialog('open');
} 

MaterialControl.MaterialDelete=function(){
    var instance = $('#project-view').jstree(true);
    var res = instance.delete_node(this.current);
    this.current=null;
    console.log('delete material: ' + res);
} 

function CheckMaterialName(name)
{
    if(name=='')
        return false;

    var all=MaterialsControl.GetAllMaterials();
    var res=true;
    for(var i in all)
    {
        if(all[i]==name)
        {
            res=false;
            break;
        }
    }
    for(var i in MaterialsModel.Elements)
    {
        if(MaterialsModel.Elements[i].name==name)
        {
            res=false;
            break;
        }
    }
    for(var i in MaterialsModel.Materials)
    {
        if(MaterialsModel.Materials[i].name==name)
        {
            res=false;
            break;
        }
    }
    return res;
}

function NewComponentNode(t,w){
    var node = NewNode(t,'component');
    node.data.weight=w;
    node.data.name=node.text;
    return node;
}

function NewMaterialNode(t, d=1){
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
    child.children.push(new NewComponentNode('e_Hydrogen',2));
    child.children.push(new NewComponentNode('e_Oxygen',1));
    node.children.push(child);
    child=NewMaterialNode('Vaccum',0.0000000001);
    child.children.push(new NewComponentNode('e_Hydrogen',1));
    node.children.push(child);
    child=NewMaterialNode('Air',0.000129);
    child.children.push(new NewComponentNode('e_Oxygen',0.21));
    child.children.push(new NewComponentNode('e_Nitrogen',0.79));
    child.data.weight='fraction';
    node.children.push(child);
}

function NewMaterialsNode()
{
    var node=NewNode('Materials','materials');
    PackDefaultMaterial(node);
    return node;
}

MaterialsControl.CheckAndAdd=function(name)
{
    var instance = $('#project-view').jstree(true);
    var current=this.current;
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
                if(InputCBObject.CheckAndAdd(value))
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

MaterialControl.AddComponent=function(){
    InputCBObject=MaterialControl;
    $('#dialog-select-name').dialog('open');
} 

MaterialControl.CheckAndAdd=function(name)
{
    var current=this.current;
    if(!CheckComponentName(name,current))
    {
        alert('Already exist the same component!');
        return false;
    }
    var node = NewComponentNode(name,0);
    var instance = $('#project-view').jstree(true);
    var res = instance.create_node(current,node);
    console.log('create component: ' + res);
    return true;
}

function CheckComponentName(name,current)
{
    return true;
}

ComponentControl.DeleteComponent=function()
{
    var instance = $('#project-view').jstree(true);
    var res = instance.delete_node(this.current);
    this.current=null;
    console.log('delete component: ' + res);
}

function InputSelectDialogInit()
{
    $( "#dialog-select-name" ).dialog({
        autoOpen: false,
        height: 200,
        width: 400,
        modal: true,
        buttons: {
            OK: function() {
                var value= $( "#dialog-select-name select[name=name]").val();
                console.log('select text: ', value);
                if(InputCBObject.CheckAndAdd(value))
                    $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            },
        },
        close: function() {
        }
    });
};

MaterialControl.NameChanged=function(el)
{
    var name=$(el).val();
    if(!CheckMaterialName(name))
    {
        alert('Already exist the same material!');
        return false;
    }
    this.current.data.name=name;
    var instance = $('#project-view').jstree(true);
    instance.rename_node(this.current,name);
};

MaterialControl.DensityChanged=function(el)
{
    var name=$(el).val();
    this.current.data.density=name;
};

MaterialControl.TypeChanged=function(el)
{
    var current =this.current;
    var name=$(el).val();
    current.data.type=name;

    var instance = $('#project-view').jstree(true);
    for(let id of current.children)
    {
        var res = instance.delete_node(id);
    }
    for(let id of current.children)
    {
        var res = instance.delete_node(id);
    }
    console.log('delete all components: ' + current.data.name);
};

MaterialControl.WeightChanged=function(el)
{
    var name=$(el).val();
    this.current.data.weight=name;
};

ComponentControl.WeightChanged=function(el)
{
    var name=$(el).val();
    this.current.data.weight=name;
};

MaterialControl.AddComponent=function(){
    var current=this.current;
    if(current.data.type=='element') {
        var select=$( "#dialog-select-name" ).find('select[name=name]');
        select.empty();
        for(var i in MaterialsModel.Elements)
        {
            var name=MaterialsModel.Elements[i].name;
            select.append('<option>'+name+'</option>');
        }

    }

    else if(current.data.type=='mixture'){

        var select=$( "#dialog-select-name" ).find('select[name=name]');
        select.empty();
        var all=MaterialsControl.GetAllMaterials();
        for (var i in all)
        {
            if(all[i]!=current.data.name)
                select.append('<option>' + all[i] +'</option>');
        }
        for(var i in MaterialsModel.Materials)
        {
            if(MaterialsModel.Materials[i].name!=current.data.name)
            {
                select.append('<option>' + MaterialsModel.Materials[i].name +'</option>');
            }
        }
    }

    InputCBObject=MaterialControl;
    $('#dialog-select-name').dialog('open');
}; 

MaterialsControl.InitSystemMaterialsListDlg=function()
{
    $( "#system-materials-tbody" ).selectable();

    $( "#system-materials-list" ).dialog({
        autoOpen: false,
        height: 640,
        width: 480,
        modal: false,
        buttons: {
            Close: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
}
MaterialsControl.InitSystemElementsListDlg=function()
{
    $( "#system-elements-tbody" ).selectable();

    $( "#system-elements-list" ).dialog({
        autoOpen: false,
        height: 640,
        width: 480,
        modal: false,
        buttons: {
            Close: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
}

MaterialsControl.OpenSystemMaterialsListDlg=function()
{
    if(!MaterialsModel.Materials)
        return;
    var data=MaterialsModel.Materials
    var tbody=$('#system-materials-tbody');
    tbody.empty();
    var that=this;
    for(var i=0; i< data.length; i++)
    {
        tbody.append('<tr >' +
            '<td>' + data[i].name+'</td>' +
            '<td>' + data[i].density+'</td>' +
            '<td>' + data[i].Z + '</td>' +
            '<td>' + data[i].atom + '</td>' +
            '</tr>');
    }
    $( "#system-materials-list" ).dialog("open");
};

MaterialsControl.OpenSystemElementsListDlg=function()
{
    if(!MaterialsModel.Elements)
        return;
    var data=MaterialsModel.Elements;
    var tbody=$('#system-elements-tbody');
    tbody.empty();
    var that=this;
    for(var i=0; i< data.length; i++)
    {
        tbody.append('<tr >' +
            '<td>' + data[i].name+'</td>' +
            '<td>' + data[i].formula+'</td>' +
            '<td>' + data[i].Z + '</td>' +
            '<td>' + data[i].atom + '</td>' +
            '</tr>');
    }
    $( "#system-elements-list" ).dialog("open");
};

