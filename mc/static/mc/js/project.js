$(document).ready(function () {
    InitProject(); 
});

var project_tree=new Array;
var current_project=null;
var current_node=null;

function InitProject(){
    $('#new-project').click(NewProject);
    $('#open-project').click(OpenProject);
    $('#save-project').click(SaveProject);
    $('#close-project').click(CloseProject);
} 

function NewProject() {
    project1=NewNode('MyProject','project');
    project1.children.push(NewGeometryNode('Geometry')); 
    project1.children.push(NewNode('Physics','physics')); 
    project1.children.push(NewNode('Primary','primary')); 
    project1.children.push(NewNode('Materials','materials')); 
    project_tree.push(project1);
    current_project=project1;
    $('#project-view').jstree(
        {
            core : {
                data: project_tree,
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
            plugins: ["types"],
            //plugins: ["contextmenu"]
        }
    );
    $('#project-view').on("select_node.jstree", NodeSelected);
}

function NodeSelected(event, data) {
    var current=data.instance.get_selected(true)[0];
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
    $('#property-container').append(property);
    DrawModel(current);
}
function OpenProject() {
}

function SaveProject() {
}

function CloseProject() {
}
