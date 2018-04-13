$(document).ready(function () {
   InitDisplay3D(); 
});

var scene, camera, render;
var geometry, material, mesh;
var width=600;
var height=480;
var light;
var controls;
var font;
var show_in_parent=true;
var daxis={
    x:20,
    y:20,
    z:20,
    unit:'cm',
};

function InitDisplay3D() {
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    var bb = document.getElementById('myTabContent').getBoundingClientRect();
    width = bb.width-50;
    height=window.innerHeight-250;

    InitRender();
    InitCamera();
    InitControls();
    InitScene();
    InitLight();
    Animate();
    LoadFont();
}
function InitRender() {
   render=new THREE.WebGLRenderer({antialias:true});
   render.setSize(width, height );
   render.setClearColor(0xf0f0f0, 1.0);
   document.getElementById('3d_canvas').appendChild(render.domElement);
}
function InitControls() {
    controls = new THREE.TrackballControls( camera, render.domElement );
    controls.rotateSpeed = 4.0;
    controls.zoomSpeed = 4.0;
    controls.panSpeed = 2;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 1.0;
    controls.keys = [ 65, 83, 68 ];
    render.domElement.addEventListener( 'mousemove', onMouseMove );
    render.domElement.addEventListener( 'mousedown', onMouseDown );
}

function InitCamera() { 
    camera = new THREE.PerspectiveCamera( 70, width / height , 1 , 5000 );
    camera.position.x = -100;
    camera.position.y = -100;
    camera.position.z = -100;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt( {x:0, y:0, z:0 } );
}

function InitScene() {   
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
}

function InitLight() { 
    light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(200, 200, 200).normalize();
    scene.add(light);
    var amb = new THREE.AmbientLight( 0x101010 ); // soft white light
    scene.add(amb);
}

function Animate() {
    requestAnimationFrame(Animate);
    controls.update();
	render.render(scene, camera);
}

function CalcGeometry(node,lunit='mm',aunit='deg')
{
    var solid=node.data.solid;
    var parameter=solid.parameter;
    var type=solid.type;
    var geometry = null;
    if(type=='box')
    {
        geometry = new THREE.BoxGeometry(parameter.x*UnitOf(parameter.lunit)/UnitOf(lunit), 
            parameter.y*UnitOf(parameter.lunit)/UnitOf(lunit), 
            parameter.z*UnitOf(parameter.lunit)/UnitOf(lunit));
    }
    else if(type=='tube')
    {
        geometry =  
         TubeGeometry(parameter.rmin*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.rmax*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.z*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.startphi*UnitOf(parameter.aunit)/UnitOf(aunit),
             parameter.deltaphi*UnitOf(parameter.aunit)/UnitOf(aunit));
    }
    else if(type=='sphere')
    {
        geometry =  
         SphereGeometry(parameter.rmin*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.rmax*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.starttheta*UnitOf(parameter.aunit)/UnitOf(aunit),
             parameter.deltatheta*UnitOf(parameter.aunit)/UnitOf(aunit),
             parameter.startphi*UnitOf(parameter.aunit)/UnitOf(aunit),
             parameter.deltaphi*UnitOf(parameter.aunit)/UnitOf(aunit))
    }
    else if(type=='cone')
    {
        geometry =  
         ConeGeometry(parameter.z*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.rmin1*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.rmax1*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.rmin2*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.rmax2*UnitOf(parameter.lunit)/UnitOf(lunit),
             parameter.startphi*UnitOf(parameter.aunit)/UnitOf(aunit),
             parameter.deltaphi*UnitOf(parameter.aunit)/UnitOf(aunit))
    }
    return geometry;
}


var meshs=new Array();
function DrawModel(node)
{
    var current=node;
    if(show_in_parent)
    {
        var instance = $('#project-view').jstree(true);
        var par=instance.get_node(node.parent);
        if(par.type=='volume')
            node=par;
    }

    var solid=node.data.solid;
    var lunit_d=solid.parameter.lunit;
    var aunit_d='deg';
    var geometry = CalcGeometry(node,lunit_d,aunit_d);
    if(geometry==null)
        return;
    var color=0x2194ce;
    if(node.children.length>0)
    {
        //material = new THREE.MeshPhongMaterial(
            //{color: 0x000000,shininess:80, transparent: true, opacity: 0.1});
        material = new THREE.MeshBasicMaterial( {color:0x000000, wireframe: true} );
    }
    else
    {
        material = new THREE.MeshPhongMaterial(
            {color: color,shininess:80});
        material.emissive.setHex(color);
    }

    meshs=new Array();
    var root = new THREE.Mesh(geometry, material);
    root.ID = node.id;
    //meshs.push(root);
    var instance = $('#project-view').jstree(true);
    for(var i=0;i <node.children.length;i++)
    {
        var child = instance.get_node(instance.get_node(node.children[i]));
        if(child == null || child.type != 'volume')
            continue;
        var geo=CalcGeometry(child,lunit_d,aunit_d);
        if(geo != null )
        {
            var pos=child.data.placement.position;
            var rot=child.data.placement.rotation;
            //var mat = new THREE.MeshBasicMaterial({color: color});
            color=color-100;
            var mat = new THREE.MeshPhongMaterial({color: color,shininess:80});
            if(child===current)
                mat.emissive.setHex( 0xff0000 );
            else
                mat.emissive.setHex(color);
            var obj = new THREE.Mesh(geo, mat);
            var lunit=UnitOf(pos.lunit)/UnitOf(lunit_d);
            var aunit=UnitOf(rot.aunit)/UnitOf(aunit_d);
            obj.position.x=pos.x*lunit;
            obj.position.y=pos.y*lunit;
            obj.position.z=pos.z*lunit;
            obj.rotation.x=rot.x*aunit;
            obj.rotation.y=rot.y*aunit;
            obj.rotation.z=rot.z*aunit;
            obj.ID = node.children[i];
            meshs.push(obj);
            root.add(obj);
        }
    }
    //root.scale.x=1.0;
    //root.scale.y=1.0;
    //root.scale.z=1.0;
    //InitScene();
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    InitLight();
    scene.add(root);
    var bbox = new THREE.Box3().setFromObject(root);
    DrawAxis(bbox,lunit_d,aunit);
    render.clear(); 
    //Animate();
}

var mouse = new THREE.Vector2();
var INTERSECTED;
var raycaster = new THREE.Raycaster();
function onMouseMove( event ) {
    var canvas = render.domElement;
    var rect = canvas.getBoundingClientRect();
    mouse.x=(event.pageX - rect.left)/width*2 - 1;
    mouse.y=-(event.pageY - rect.top)/height*2 + 1;
    $('#mouse_position').html('Mouse: (' + mouse.x + ', ' + mouse.y + ')');
    PickObject();
}
function PickObject()
{
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects(meshs);
    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
        }
    } else {
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }
}

var default_font = {
    font:font, 
    size: 0.5,
    height: 0.2};
function DrawAxis(bbox,lunit='cm',aunit='deg')
{
    var offset=0;
    var text_off=1;
    var geo_x = new THREE.Geometry();
    geo_x.vertices.push( new THREE.Vector3( bbox.min.x-offset, 0, 0 ));
    geo_x.vertices.push( new THREE.Vector3( bbox.max.x+offset, 0, 0 ) );
    var mat_x =  new THREE.LineBasicMaterial( { color: 0xff0000} );
    var axis_x = new THREE.Line( geo_x, mat_x);
    var group_x = new THREE.Group();

    var labe_x = new THREE.TextGeometry(bbox.max.x+lunit+'(X)',default_font);
    var mesh_x = new THREE.Mesh(labe_x,mat_x);
    mesh_x.position.x = bbox.max.x+offset+text_off;
    mesh_x.position.y = -text_off/4;

    var labe_x1 = new THREE.TextGeometry(bbox.min.x,default_font);
    var mesh_x1 = new THREE.Mesh(labe_x1,mat_x);
    mesh_x1.position.x = bbox.min.x-offset-text_off;
    mesh_x1.position.y = -text_off/4;

    group_x.add(axis_x);
    group_x.add(mesh_x);
    group_x.add(mesh_x1);

    var geo_y = new THREE.Geometry();
    geo_y.vertices.push( new THREE.Vector3( 0, bbox.min.y-offset, 0 ));
    geo_y.vertices.push( new THREE.Vector3( 0, bbox.max.y+offset, 0 ) );
    var mat_y = new THREE.LineBasicMaterial( { color: 0x00ff00} );
    //mat_y.emissive.setHex(0x00ff00);
    var axis_y = new THREE.Line( geo_y, mat_y);
    var group_y = new THREE.Group();

    var labe_y = new THREE.TextGeometry(bbox.max.y+lunit+'(Y)',default_font);
    var mesh_y = new THREE.Mesh(labe_y,mat_y);
    mesh_y.position.y = bbox.max.y+offset+text_off;
    mesh_y.position.x = -text_off/1.5;

    var labe_y1 = new THREE.TextGeometry(bbox.min.y,default_font);
    var mesh_y1 = new THREE.Mesh(labe_y1,mat_y);
    mesh_y1.position.y = bbox.min.y-offset-text_off;
    mesh_y1.position.x = -text_off/4;

    group_y.add(axis_y);
    group_y.add(mesh_y);
    group_y.add(mesh_y1);

    var geo_z = new THREE.Geometry();
    geo_z.vertices.push( new THREE.Vector3( 0, 0, bbox.min.z-offset));
    geo_z.vertices.push( new THREE.Vector3( 0, 0, bbox.max.z+offset) );
    var mat_z = new THREE.LineBasicMaterial( { color: 0x0000ff} );
    //mat_z.emissive.setHex(0x0000ff);
    var axis_z = new THREE.Line( geo_z, mat_z);
    var group_z = new THREE.Group();

    var labe_z = new THREE.TextGeometry(bbox.max.z+lunit+'(Z)',default_font);
    var mesh_z = new THREE.Mesh(labe_z,mat_z);
    mesh_z.position.z = bbox.max.z+offset+text_off;
    mesh_z.position.x = -text_off/1.5;

    var labe_z1 = new THREE.TextGeometry(bbox.min.z,default_font);
    var mesh_z1 = new THREE.Mesh(labe_z1,mat_z);
    mesh_z1.position.z = bbox.min.z-offset-text_off;
    mesh_z1.position.x = -text_off/2;
    group_z.add(axis_z);
    group_z.add(mesh_z);
    group_z.add(mesh_z1);

    scene.add(group_x);
    scene.add(group_y);
    scene.add(group_z);

}

function LoadFont() 
{
    var loader = new THREE.FontLoader();
    loader.load('/static/three.js/helvetiker_regular.typeface.json', function(f) {
        font=f;
        default_font.font=f;
    });
}

function onMouseDown( event ) {
    if ( !INTERSECTED ) 
        return;
    id=INTERSECTED.ID;
    console.log("Click node: "+id);
    var instance = $('#project-view').jstree(true);
    //var res=instance.activate_node(id);
    instance.deselect_all();
    var res=instance.select_node(id);
}
