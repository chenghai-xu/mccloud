$(document).ready(function () {
    InitProject(); 
    ProjectDialogInit();
    csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    if(!id_current_project)
    {
        DownloadProject(-1);
    }
});
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
var id_selected_project=null;
var id_current_project = null;
var project_records = new Map();
var node_selected_hook = new Map();
var csrftoken=null;

var NodeWatch = {type_control: new Map(), type_selector: new Map(), }; 
NodeWatch.Add=function(type,selector,control)
{
    this.type_control.set(type,control);
    this.type_selector.set(type,selector);
};

function InitProject(){
    $('#new-project').click(NewProject);
    $('#open-project').click(OpenProject);
    $('#save-project').click(SaveProject);
    $('#close-project').click(CloseProject);
} 

function LoadProject(project) {
    $('#project-view').jstree(
        {
            core : {
                data: [project],
                multiple: false,
                check_callback: true
            },
            types: {
                project: {
                    "icon": ""
                },
                geometry: {
                    "icon": ""
                },
                volume: {
                    "icon": ""
                },
                materials: {
                    "icon": ""
                },
                material: {
                    "icon": ""
                },
                component: {
                    "icon": ""
                },
                primary: {
                    "icon": ""
                },
                source: {
                    "icon": ""
                },
                particle: {
                    "icon": ""
                },
                position: {
                    "icon": ""
                },
                direction: {
                    "icon": ""
                },
                energy: {
                    "icon": ""
                },
                time: {
                    "icon": ""
                },
                physics: {
                    "icon": ""
                },
                run: {
                    "icon": ""
                },
                output: {
                    "icon": ""
                },
                mesh: {
                    "icon": ""
                },
                dist: {
                    "icon": ""
                },
                log: {
                    "icon": ""
                },
            },
            plugins: ["types","contextmenu"],
            contextmenu: {
                "items": function ($node) {
                    return {
                        Rename: {
                            "separator_before": false,
                            "separator_after": false,
                            "label": "Rename",
                            "action": RenameNode 
                        }
                    };
                }
            }
        });
    $('#project-view').on("select_node.jstree", NodeSelected);
    setTimeout(InitControl,1000);

}

function InitControl(instance,id)
{
    var id='#';
    var instance = $('#project-view').jstree(true);

    //root node
    var node = instance.get_node(id);
    if(!node || !node.type)
    {
        return;
    }
    var control=NodeWatch.type_control.get(node.type);
    if(control)   
    {
        control.current=node;
    }

    //children node
    for(let id of node.children_d)
    {
        var n = instance.get_node(id);
        if(!n || !n.type)
        {
            continue;
        }
        var c=NodeWatch.type_control.get(n.type);
        if(c)   
        {
            c.current=n;
        }
    }
}

function NewProject() {
    CloseProject();
    var project=NewNode('MyProject','project');
    project.children.push(NewGeometryNode('Geometry')); 
    project.children.push(NewPhysicsNode()); 
    project.children.push(NewPrimaryNode()); 
    project.children.push(NewMaterialsNode()); 
    project.children.push(RunModel.New()); 
    project.children.push(OutputModel.New()); 
    LoadProject(project);
    $.post({ 
        url: "/mc/api/project/", 
        data:'',
        success: function(data)
        {
            project=data;
            project_records.set(data.id,project);
            id_current_project=data.id;
            SaveProject();
        }
    });
}

function RenameNode(data) {
    var inst = $.jstree.reference(data.reference);
    var current = inst.get_node(data.reference);
    var par = inst.get_node(inst.get_parent(current));
    if(RenameAble(current,par))
    {
        inst.edit(current);
    }

}

function RenameAble(node, parent) {
    if(node.type==='project')
        return true;
    return false;
}

function NodeSelected(event, data) {
    var current=data.instance.get_selected(true)[0];
    console.log('Select node: ',current.id);
    $('#property-current').remove();
    $('#property-detail-current').remove();

    control=NodeWatch.type_control.get(current.type);
    selector=NodeWatch.type_selector.get(current.type);
    if(control && selector)
    {
        var property = $(selector).clone();
        property.attr("id","property-current");
        property.removeClass('hidden');

        control.current=current;
        control.form=property;
        control.Init();
        $('#property-container').append(property);
    }
}
function OpenProject() {
    $.get({ 
        url: "/mc/api/project/", 
        data:{},
        success: SelectProject
    });
}

function SaveProject(cb=null) {
    if (!$.jstree.reference($('#project-view'))) {
        return;
    }

    var instance = $('#project-view').jstree(true);
    for(var t in instance._model.data)
    {
        var node=instance._model.data[t];
        if(node.type=='default')
        {
            console.log('project is invalid, refuse to save!');
            return;
        }
    }

    var json=$('#project-view').jstree().get_json('#',{no_state:true, no_li_attr:true, no_a_attr: true });
    //console.log(JSON.stringify(json[0]));
    console.log('Save project', id_current_project);
    $.post({ 
        url: "/mc/project-tree/?id="+id_current_project, 
        data:JSON.stringify(json[0]),
        success: function(data){
            //console.log(data);
            console.log('Post project tree success: ');
            if(cb && {}.toString.call(cb) === '[object Function]')
            {
                cb();
            }
        }
    });
}

function CloseProject() {
    SaveProject();
    if($.jstree.reference($('#project-view'))) {
        $('#project-view').jstree().delete_node($('#project-view').jstree().get_json());
    }
    $('#project-view').jstree('destroy');
}

function ProjectDialogInit()
{
    $( "#project-tbody" ).selectable();

    $( "#project-list" ).dialog({
        autoOpen: false,
        height: 480,
        width: 400,
        modal: true,
        buttons: {
            "Open": function() {
                CloseProject();
                id_current_project=parseInt(id_selected_project);
                DownloadProject(id_selected_project);
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

function DownloadProject(id)
{
    $.get({ 
        url: "/mc/project-tree/?id="+id, 
        success: function(data){
            project=JSON.parse(data.data)
            //console.log(data);
            console.log('Download project tree: ',data.id);
            LoadProject(project);
            id_current_project=data.id;
        }
    });
}

function SelectProject(data)
{
    //console.log(data);
    console.log('List of projects: ',data.length);
    var tbody=$('#project-tbody');
    tbody.empty();
    for(var i=0; i< data.length; i++)
    {
        project_records.set(data[i].id,data[i]);
        tbody.append('<tr id='+data[i].id+'>' +
            '<td>' + data[i].id + '</td>' +
            '<td>' + data[i].name + '</td>' +
            '<td>' + data[i].create_time.substring(0,10) + '</td>' +
            '<td>' + data[i].update_time.substring(0,10) + '</td>' +
            '</tr>');
    }
    $('#project-tbody tr').click(function (event) {
        $('#project-tbody tr').css("background-color", "white");
        var id=$(this).attr('id'); 
        $(this).css("background-color", "red");
        id_selected_project=id;
    });
    $( "#project-list" ).dialog("open");
}
