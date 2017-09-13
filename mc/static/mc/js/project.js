$(document).ready(function () {
    InitProject(); 
    ProjectDialogInit();
});
var current_project = null;
var project_records = new Map();

function InitProject(){
    $('#new-project').click(NewProject);
    $('#open-project').click(OpenProject);
    $('#save-project').click(SaveProject);
    $('#close-project').click(CloseProject);
} 

function LoadProject(project) {
    CloseProject();
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
                physical: {
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
                physics: {
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
}

function NewProject() {
    var project=NewNode('MyProject','project');
    project.children.push(NewGeometryNode('Geometry')); 
    project.children.push(NewNode('Physics','physics')); 
    project.children.push(NewNode('Primary','primary')); 
    project.children.push(NewNode('Materials','materials')); 
    LoadProject(project);
    $.post({ 
        url: "/mc/api/project/", 
        data:'',
        success: PostProject
    });
}
function PostProject(data)
{
    project=JSON.parse(data);
    project_records.set(data.id,project);
    current_project=data.id;
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
    if(node.type === 'physical' && parent.type != 'geometry')
        return true;
    return false;
}

function NodeSelected(event, data) {
    var current=data.instance.get_selected(true)[0];
    console.log('Select node: ',current.id);
    $('#property-current').remove();
    $('#property-detail-current').remove();
    SelectedPhysical(current);
    SelectedMaterials(current);
}
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
function SelectedPhysical(current)
{
    if(current.type != 'physical')
        return;
    var property = $('#property-physical').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    $(property).find('select[name=solid]').val(current.data.solid.type);
    $(property).find('#current-node-name').html('Volume: ' +current.text);

    $('#property-container').append(property);
    DrawModel(current);
}

function OpenProject() {
    $.get({ 
        url: "/mc/api/project/", 
        data:{},
        success: SelectProject
    });
}

function SaveProject() {
    if (!$.jstree.reference($('#project-view'))) {
        return;
    }
    var json=$('#project-view').jstree().get_json('#',{no_state:true, no_li_attr:true, no_a_attr: true });
    //console.log(JSON.stringify(json[0]));
    console.log('Save project', current_project);
    $.post({ 
        url: "/mc/project-tree/?id="+current_project, 
        data:JSON.stringify(json[0]),
        success: function(data){
            //console.log(data);
            console.log('Post project tree: ',current_project);
        }
    });
}

function CloseProject() {
    SaveProject();
    if ($.jstree.reference($('#project-view'))) {
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
                console.log('Load project ',project_selection);
                current_project=parseInt(project_selection);
                DownloadProject(project_selection);
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
            data=JSON.parse(data)
            //console.log(data);
            console.log('Download project tree: ',id);
            LoadProject(data);
        }
    });
}

var project_selection=null;
function SelectProject(data)
{
    //console.log(data);
    console.log('Select project: ',data.length);
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
        project_selection=id;
    });
    $( "#project-list" ).dialog("open");
}
