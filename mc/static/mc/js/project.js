$(document).ready(function () {
    InitProject(); 
});

var project_tree=new Array;
var current_project=null;
var current_node=null;

function NewNode(t,type){
    var node={
        text: t,
        children: new Array(),
        type: type,
        data:
        {
        },
    };
    return node;
}

function NewGeometryNode(t){
    var node=NewNode(t,'geometry');
    node.children.push(NewPhysicalNode('world',true));
    node.children.push(NewPhysicalNode('parallel',true));
    return node;
}

function NewSolid(type='box'){
    var node=null;
    if(type=='box')
        node=
        {
            type:'box',
            parameter: 
            {
                x:1.0,
                y:1.0,
                z:1.0,
                lunit:'cm',
            },
        };
    else if(type=='tube')
        node=
        {
            type:'tube',
            parameter: 
            {
                rmin:0.0,
                rmax:1.0,
                z:1.0,
                startphi:0,
                deltaphi:360,
                lunit:'cm',
                aunit:'deg',
            },
        };
    else 
        node=
        {
            type:'box',
            parameter: 
            {
                x:1.0,
                y:1.0,
                z:1.0,
                lunit:'cm',
            },
        };

    return node;
}
function NewPosition(){
    var node=
        {
            x:0.0,
            y:0.0,
            z:0.0,
            lunit:'cm',
        };
    return node;
}
function NewRotation(){
    var node=
        {
            x:0.0,
            y:0.0,
            z:0.0,
            aunit: 'deg',
        };
    return node;
}
function NewPlacement(){
    var node=
        {
            type:'simple',
            position: NewPosition(),
            rotation: NewRotation(),
        };
    return node;
}
function NewPhysicalNode(t,world=false){
    var node=NewNode(t,'physical');
    node.data.solid=NewSolid();
    node.data.material='Water'
    if(world==false){
        node.data.placement=NewPlacement();
    }
    return node;
}

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
