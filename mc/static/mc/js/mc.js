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
    node.data.material='Vaccum'
    if(world==false){
        node.data.placement=NewPlacement();
    }
    return node;
}

function NewComponent(t,w){
    var node = NewNode(t,'component');
    node.data.weight=w;
    node.data.name=node.text;
    return node;
}
function NewMaterial(t){
    var node=NewNode(t,'material');
    node.data.type='element';
    node.data.weight='composite';
    node.data.name=node.text;
    node.data.density=0.0;

    //node.children.push(NewComponent('H',1.0));
    return node;
}


var unit_map = new Map();
unit_map.set('mm',0.1);
unit_map.set('cm',1.0);
unit_map.set('m',100);
unit_map.set('km',1000);
unit_map.set('mm2',0.01);
unit_map.set('cm2',1.0);
unit_map.set('m2',10000);
unit_map.set('km2',1000000);
unit_map.set('mm3',0.001);
unit_map.set('cm3',1.0);
unit_map.set('m3',1000000);
unit_map.set('km3',1000000000);
unit_map.set('deg',1.0);
unit_map.set('rad',Math.PI/180);

function UnitOf(u)
{
    var res = unit_map.get(u.toLowerCase());
    if(res==undefined)
        res=1.0
    return res;
}
