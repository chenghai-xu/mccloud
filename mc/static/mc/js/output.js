$(document).ready(function () {
    NodeWatch.Add('output','#property-output',OutputForm);
    NodeWatch.Add('mesh','#property-mesh',MeshForm);
    NodeWatch.Add('dist','#property-dist',DistForm);
    NodeWatch.Add('log','#property-log',LogForm);
    OutputForm.InitJobListDlg();
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
    $(this.form).find('#job-status').text(this.current.data.job.status);
    $(this.form).find('#job-id').text(this.current.data.job.id);
};
OutputForm.Select=function(el)
{
};
OutputForm.Update=function(el,id=null)
{
    if(!id)
        id=this.current.data.job.id;
    $.get({ 
        url: "/mc/api/output/?id="+id, 
        data:{},
        success: function(data)
        {
            console.log("job output:");
            MeshForm.current.data.mesh=data.mesh;
            DistForm.current.data.dist=data.dist;
            LogForm.current.data.log=data.log;
            OutputForm.current.data.job=data.job;
            OutputForm.Init();
        },
    });
};
OutputForm.Download=function()
{
    $.get({ 
        url: "/mc/job/download/?id="+this.current.data.job.id, 
        data:{},
        success: function(data)
        {
            console.log("download job:");
        },
    });
};

OutputForm.Open=function()
{
    var that=this;
    $.get({ 
        url: "/mc/api/job/list/?id="+id_current_project, 
        data:{},
        success: function(data)
        {
            console.log("job list output:");
            that.OpenJobListDlg(data);
        },
    });
};
OutputForm.InitJobListDlg=function()
{
    $( "#job-tbody" ).selectable();

    $( "#job-list" ).dialog({
        autoOpen: false,
        height: 480,
        width: 720,
        modal: true,
        buttons: {
            "Open": function() {
                OutputForm.Update(null,OutputForm.select_job_id);
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
};

OutputForm.OpenJobListDlg=function(data)
{
    var tbody=$('#job-tbody');
    tbody.empty();
    var that=this;
    for(var i=0; i< data.length; i++)
    {
        tbody.append('<tr id='+data[i].id+'>' +
            '<td>' + data[i].create_time.substring(0,16)+'</td>' +
            '<td>' + data[i].instance + '</td>' +
            '<td>' + data[i].nodes + '</td>' +
            '<td>' + Math.round(data[i].times*60) + '</td>' +
            '<td>' + data[i].status + '</td>' +
            '</tr>');
    }
    $('#job-tbody tr').click(function (event) {
        $('#job-tbody tr').css("background-color", "white");
        var id=$(this).attr('id'); 
        $(this).css("background-color", "red");
        that.select_job_id=id;
    });
    $( "#job-list" ).dialog("open");
};

MeshForm.Init=function()
{
    if(!this.current.data.mesh)
        return;
    $('#myTab #profile-tab').tab('show');
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
    $('#myTab #profile-tab').tab('show');
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
    $('#myTab #contact-tab').tab('show');
    var select=$(this.form).find('select[name=file]');
    select.empty();
    for (var m of this.current.data.log)
    {
        select.append('<option>' + m +'</option>');
    }
};

LogForm.Update=function()
{
    var file=$(this.form).find('select[name=file]').val();
    $.get({ 
        url: "/mc/api/log/?id="+OutputForm.current.data.job.id + "&fname="+file, 
        success: function(data)
        {
            console.log("job log.");
            $('#Console #output').text(data.data);
        },
    });
};

