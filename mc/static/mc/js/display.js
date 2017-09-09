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

function InitDisplay3D() {
    if (!Detector.webgl) Detector.addGetWebGLMessage();
    var bb = document.getElementById('3d_canvas').getBoundingClientRect();
    width = bb.right - bb.left;
    height=window.innerHeight-150;

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

function CalcGeometry(node)
{
    var solid=node.data.solid;
    var parameter=solid.parameter;
    var type=solid.type;
    var geometry = null;
    var lunit='mm';
    var aunit='deg'
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
    return geometry;
}


var meshs=new Array();
function DrawModel(node)
{
    if(show_in_parent)
    {
        var instance = $('#project-view').jstree(true);
        var par=instance.get_node(node.parent);
        if(par.type=='physical')
            node=par;
    }

    var solid=node.data.solid;
    var geometry = CalcGeometry(node);
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
        if(child == null || child.type != 'physical')
            continue;
        var geo=CalcGeometry(child);
        if(geo != null )
        {
            var pos=child.data.placement.position;
            var rot=child.data.placement.rotation;
            //var mat = new THREE.MeshBasicMaterial({color: color});
            color=color-100;
            var mat = new THREE.MeshPhongMaterial({color: color,shininess:80});
            mat.emissive.setHex(color);
            var obj = new THREE.Mesh(geo, mat);
            obj.position.x=pos.x*10;
            obj.position.y=pos.y*10;
            obj.position.z=pos.z*10;
            obj.rotation.x=rot.x;
            obj.rotation.y=rot.y;
            obj.rotation.z=rot.z;
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
    DrawAxis();
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
    size: 5,
    height: 1};
function DrawAxis()
{
    var geo_x = new THREE.Geometry();
    geo_x.vertices.push( new THREE.Vector3( -100, 0, 0 ));
    geo_x.vertices.push( new THREE.Vector3( 100, 0, 0 ) );
    var mat_x =  new THREE.LineBasicMaterial( { color: 0xff0000} );
    var axis_x = new THREE.Line( geo_x, mat_x);
    var group_x = new THREE.Group();

    var labe_x = new THREE.TextGeometry('100 X',default_font);
    var mesh_x = new THREE.Mesh(labe_x,mat_x);
    mesh_x.position.x = 105;
    mesh_x.position.y = -2.5;

    var labe_x1 = new THREE.TextGeometry('-100',default_font);
    var mesh_x1 = new THREE.Mesh(labe_x1,mat_x);
    mesh_x1.position.x = -120;
    mesh_x1.position.y = -2.5;

    group_x.add(axis_x);
    group_x.add(mesh_x);
    group_x.add(mesh_x1);

    var geo_y = new THREE.Geometry();
    geo_y.vertices.push( new THREE.Vector3( 0, -100, 0 ));
    geo_y.vertices.push( new THREE.Vector3( 0, 100, 0 ) );
    var mat_y = new THREE.LineBasicMaterial( { color: 0x00ff00} );
    //mat_y.emissive.setHex(0x00ff00);
    var axis_y = new THREE.Line( geo_y, mat_y);
    var group_y = new THREE.Group();

    var labe_y = new THREE.TextGeometry('100 Y',default_font);
    var mesh_y = new THREE.Mesh(labe_y,mat_y);
    mesh_y.position.y = 105;
    mesh_y.position.x = -10;

    var labe_y1 = new THREE.TextGeometry('-100',default_font);
    var mesh_y1 = new THREE.Mesh(labe_y1,mat_y);
    mesh_y1.position.y = -120;
    mesh_y1.position.x = -10;

    group_y.add(axis_y);
    group_y.add(mesh_y);
    group_y.add(mesh_y1);

    var geo_z = new THREE.Geometry();
    geo_z.vertices.push( new THREE.Vector3( 0, 0, -100));
    geo_z.vertices.push( new THREE.Vector3( 0, 0, 100) );
    var mat_z = new THREE.LineBasicMaterial( { color: 0x0000ff} );
    //mat_z.emissive.setHex(0x0000ff);
    var axis_z = new THREE.Line( geo_z, mat_z);
    var group_z = new THREE.Group();

    var labe_z = new THREE.TextGeometry('100 Z',default_font);
    var mesh_z = new THREE.Mesh(labe_z,mat_z);
    mesh_z.position.z = 105;
    mesh_z.position.x = -10;

    var labe_z1 = new THREE.TextGeometry('-100',default_font);
    var mesh_z1 = new THREE.Mesh(labe_z1,mat_z);
    mesh_z1.position.z = -120;
    mesh_z1.position.x = -10;
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
