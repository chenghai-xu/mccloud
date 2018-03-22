$(document).ready(function () {
    NodeWatch.Add('output','#property-output',OutputForm);
    NodeWatch.Add('mesh','#property-mesh',MeshForm);
    NodeWatch.Add('dist','#property-dist',DistForm);
    NodeWatch.Add('log','#property-log',LogForm);
});
var OutputForm = {};
var OutputModel = {};
var MeshForm = {};
var DistForm = {};
var LogForm = {};

OutputModel.New=function()
{
    var node = NewNode("Output","output");
    node.children.push(NewNode("Mesh","mesh"));
    node.children.push(NewNode("Dist","dist"));
    node.children.push(NewNode("Log","log"));
    return node;
}

OutputForm.New=function(job)
{
    var instance = $('#project-view').jstree(true);
    var root=instance.get_node("#");
    var project=instance.get_node(root.children[0]);
    var dels=[];
    for(var id of project.children)
    {
        if(instance.get_node(id).type==="output")
        {
            dels.push(id);
        }
    }
    for(var id of dels)
    {
            instance.delete_node(id);
    }
    var node = OutputModel.New();
    var res = instance.create_node(project,node);
    console.log("Create node output: ",res);
    this.current=instance.get_node(res);
    this.current.data.job=job;

    for(var id of this.current.children)
    {
        var node = instance.get_node(id);
        if(node.type==="mesh")
        {
            MeshForm.current=node;
        }
        else if(node.type==="dist")
        {
            DistForm.current=node;
        }
        else if(node.type==="log")
        {
            LogForm.current=node;
        }
    }
}

OutputForm.Init=function()
{
    if(!this.current.data.job)
        return;
    $('#myTab #profile-tab').tab('show');
};
OutputForm.Select=function(el)
{
};
OutputForm.Update=function()
{
    $.get({ 
        url: "/mc/api/output/?id="+this.current.data.job.id, 
        data:{},
        success: function(data)
        {
            console.log("job output:");
            console.log(data);
            MeshForm.current.data.mesh=data.mesh;
            DistForm.current.data.dist=data.dist;
            LogForm.current.data.log=data.log;
        },
    });
};
OutputForm.Download=function()
{
};

MeshForm.Init=function()
{
    if(!this.current.data.mesh)
        return;
    var select=$(this.form).find('select[name=file]');
    select.empty();
    for (var m of this.current.data.mesh)
    {
        select.append('<option>' + m +'</option>');
    }

};
MeshForm.Update=function()
{
    var file=$(this.form).find('select[name=file]').val();
    var axis=$(this.form).find('select[name=axis]').val();
    var index=$(this.form).find('input[name=index]').val();
    var id=OutputForm.current.data.job.id

    $.get({ 
        url: "/mc/api/mesh/?id="+id+"&fname="+file+"&axis="+axis+"&index="+index, 
        data:{},
        success: function(data)
        {
            console.log("mesh data:");
            console.log(data);
            var img=$( "#2d_canvas").find('img[id=2d_img]');
            img.attr("src",data.src);
        },
    });
    
};

DistForm.Init=function()
{
    if(!this.current.data.dist)
        return;
    var select=$(this.form).find('select[name=file]');
    select.empty();
    for (var m of this.current.data.dist)
    {
        select.append('<option>' + m +'</option>');
    }

};

DistForm.Update=function()
{
    var file=$(this.form).find('select[name=file]').val();
    var ls=$(this.form).find('select[name=ls]').val();
    var color=$(this.form).find('select[name=color]').val();
    var id=OutputForm.current.data.job.id;

    $.get({ 
        url: "/mc/api/dist/?id="+id+"&fname="+file+"&ls="+ls+"&color="+color, 
        data:{},
        success: function(data)
        {
            console.log("mesh data:");
            console.log(data);
            var img=$( "#2d_canvas").find('img[id=2d_img]');
            img.attr("src",data.src);
        },
    });
    
};

LogForm.OnClick=function(current)
{
    if(current.type != 'log')
        return;

    var property = $('#property-log').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');

    this.current=current;
    this.form=property;
    this.Init();

    $('#property-container').append(property);
};

LogForm.Init=function()
{
    if(!this.current.data.log)
        return;
    var select=$(this.form).find('select[name=file]');
    select.empty();
    for (var m of this.current.data.log)
    {
        select.append('<option>' + m +'</option>');
    }
};
LogForm.Update=function()
{
};

