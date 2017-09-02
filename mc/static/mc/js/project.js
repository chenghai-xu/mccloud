$(document).ready(function () {
   InitProject(); 
});

var project_tree=new Array;
var current_project= null

function NewNode(t){
    return {text: t};
}
function NewPhysicalNode(t){
    var node=NewNode(t);
    node.record="record"
    node.logical=NewLogicalNode('logical')
    return node;
}
function NewLogicalNode(t){
    var node=NewNode(t);
    node.solid=NewSolidNode('solid');
    node.record="record"
    return node;
}
function NewSolidNode(t){
    var node=NewNode(t);
    node.record="record"
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
    project1.nodes= new Array();
    project1.nodes.push(NewPhysicalNode('Geometry')); 
    project1.nodes.push(NewNode('Physics')); 
    project1.nodes.push(NewNode('Primary')); 
    project_tree.push(project1);
    current_project=project1;
    $('#project-view').treeview({data: project_tree});
}

function OpenProject() {
}
function SaveProject() {
}
function CloseProject() {
}
