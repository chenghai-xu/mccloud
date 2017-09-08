$(document).ready(function () {
});

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
    else if(type=='sphere')
        node=
        {
            type:'sphere',
            parameter: 
            {
                rmin:0.0,
                rmax:1.0,
                starttheta:0,
                deltatheta:180,
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

function UnitConvert(src,dst,unit)
{
}
