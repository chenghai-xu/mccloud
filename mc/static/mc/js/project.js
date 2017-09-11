$(document).ready(function () {
    InitProject(); 
});
var record_project = null;

function InitProject(){
    $('#new-project').click(NewProject);
    $('#open-project').click(OpenProject);
    $('#save-project').click(SaveProject);
    $('#close-project').click(CloseProject);
} 

function NewProject() {
    CloseProject();
    var project=NewNode('MyProject','project');
    project.children.push(NewGeometryNode('Geometry')); 
    project.children.push(NewNode('Physics','physics')); 
    project.children.push(NewNode('Primary','primary')); 
    project.children.push(NewNode('Materials','materials')); 
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
    $.post({ 
        url: "/mc/api/project/", 
        data:record_project,
        success: PostProject
    });
}
function PostProject(data)
{
    record_project=data;
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
    console.log('select node: ');
    console.log(current);
    $('#property-current').remove();
    $('#property-detail-current').remove();
    SelectedPhysical(current);
    SelectedMaterials(current);
}
function SelectedMaterials(current)
{
    if(current.type != 'materials')
        return;
    var property = $('#property-materials').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
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
}

function SaveProject() {
    if (!$.jstree.reference($('#project-view'))) {
        return;
    }
    var json=$('#project-view').jstree().get_json('#',{no_state:true, no_li_attr:true, no_a_attr: true });
    console.log(JSON.stringify(json[0]));
    $.post({ 
        url: "/mc/project/?id="+record_project.id, 
        data:JSON.stringify(json[0]),
        success: function(data){
            console.log(data);
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
