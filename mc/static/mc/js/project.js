$(document).ready(function () {
   InitProject(); 
});

var project_tree=new Array;
var current_project=null;
var current_node=null;

function NewNode(t,type){
    var node={text: t,children: new Array(),ntype: type};
    return node;
}

function NewPostionNode(t){
    var node=NewNode(t,'position');
    return node;
}

function NewRotationNode(t){
    var node=NewNode(t,'rotation');
    return node;
}

function NewMaterialNode(t){
    var node=NewNode(t,'material');
    return node;
}

function NewSolidNode(t){
    var node=NewNode(t,'solid');
    return node;
}

function NewGeometryNode(t){
    var node=NewNode(t,'geometry');
    node.children.push(NewPhysicalNode('world',true));
    node.children.push(NewPhysicalNode('parallel',true));
    return node;
}

function NewPhysicalNode(t,world=false){
    var node=NewNode(t,'physical');
    node.children.push(NewSolidNode('solid'));
    node.children.push(NewMaterialNode('material'));
    if(world==false){
        node.children.push(NewPostionNode('position'));
        node.children.push(NewRotationNode('rotation'));
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
    project1=NewNode('MyProject');
    project1.children.push(NewGeometryNode('Geometry')); 
    project1.children.push(NewNode('Physics','physics')); 
    project1.children.push(NewNode('Primary','primary')); 
    project_tree.push(project1);
    current_project=project1;
    $('#project-view').jstree({
        core : {
            data: project_tree,
            check_callback: true
        }
    });
}

function NodeSelected(event, data) {
}

function OpenProject() {
}

function SaveProject() {
}

function CloseProject() {
}
