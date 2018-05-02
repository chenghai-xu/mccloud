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
    node.children.push(NewVolumeNode('world',true));
    node.children.push(NewVolumeNode('parallel',true));
    return node;
}

var SolidFactory={};
SolidFactory.New=function(type='box'){
    var fun = this.new_map.get(type.toLowerCase());
    if(fun==undefined)
        fun=this.new_map.get('box');
    return fun();
};
SolidFactory.new_map=new Map();
SolidFactory.new_map.set('box',function(){
    var node=
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
});

SolidFactory.new_map.set('tube',function(){
    var node=
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
    return node;    
});
SolidFactory.new_map.set('sphere',function(){
    var node=
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
    return node;    
});

SolidFactory.new_map.set('cone',function(){
    var node=
        {
            type:'cone',
            parameter: 
            {
                z:1.0,
                rmin1:0.2,
                rmax1:0.4,
                rmin2:0.5,
                rmax2:1.0,
                startphi:0,
                deltaphi:360,
                lunit:'cm',
                aunit:'deg',
            },
        };
    return node;    
});

SolidFactory.new_map.set('para',function(){
    var node=
        {
            type:'para',
            parameter: 
            {
                x:1.0,
                y:1.0,
                z:1.0,
                alpha:30,
                theta:30,
                phi:30,
                lunit:'cm',
                aunit:'deg',
            },
        };
    return node;    
});

SolidFactory.new_map.set('trap',function(){
    var node=
        {
            type:'trap',
            parameter: 
            {
                z: 60,
                theta: 20,
                phi: 5,
                y1: 30,
                x1: 40,
                x2: 40,
                alpha1: 10,
                y2: 16,
                x3: 10,
                x4: 14,
                alpha2: 10,
                lunit: 'mm',
                aunit: 'deg'
            }
        };
    return node;    
});

function NewSolid(type='box'){
    return SolidFactory.New(type);
}
function NewVolumePosition(){
    var node=
        {
            x:0.0,
            y:0.0,
            z:0.0,
            lunit:'cm',
        };
    return node;
}
function NewVolumeRotation(){
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
            position: NewVolumePosition(),
            rotation: NewVolumeRotation(),
        };
    return node;
}
function NewVolumeNode(t,world=false){
    var node=NewNode(t,'volume');
    node.data.solid=NewSolid();
    node.data.material='Vaccum'
    if(world==false){
        node.data.placement=NewPlacement();
    }
    return node;
}

var unit_map = new Map();
unit_map.set('mm',1e-3);
unit_map.set('cm',1e-2);
unit_map.set('m',1);
unit_map.set('km',1e3);
unit_map.set('mm2',1e-6);
unit_map.set('cm2',1e-4);
unit_map.set('m2',1);
unit_map.set('km2',1e6);
unit_map.set('mm3',1e-9);
unit_map.set('cm3',1e-6);
unit_map.set('m3',1);
unit_map.set('km3',1e9);
unit_map.set('deg',1.0);
unit_map.set('rad',Math.PI/180);

function UnitOf(u)
{
    var res = unit_map.get(u.toLowerCase());
    if(res==undefined)
        res=1.0;
    return res;
}

