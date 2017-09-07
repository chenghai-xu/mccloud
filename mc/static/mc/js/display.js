$(document).ready(function () {
   InitDisplay3D(); 
});

var scene, camera, render;
var geometry, material, mesh;
var width=800;
var height=480;
var light;
var controls;

function InitDisplay3D() {
    if (!Detector.webgl) Detector.addGetWebGLMessage();

    InitRender();
    InitCamera();
    InitControls();
    InitScene();
    InitLight();
    Animate();
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
    //controls.addEventListener( 'change', render );
    render.domElement.addEventListener( 'mousemove', onMouseMove );
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
    PickObject();
    controls.update();
	render.render(scene, camera);
}

function CalcGeometry(node)
{
    var solid=node.data.solid;
    var geometry = null;
    if(solid.type=='box')
    {
        geometry = new THREE.BoxGeometry(solid.parameter.x*10, solid.parameter.y*10, solid.parameter.z*10);
    }
    else if(solid.type=='tube')
    {
        geometry = new 
         THREE.CylinderGeometry(solid.parameter.rmax*10,solid.parameter.rmax*10,solid.parameter.z*10);
    }
    return geometry;
}


var meshs=new Array();
function DrawModel(node)
{
    var solid=node.data.solid;
    var geometry = CalcGeometry(node);
    if(geometry==null)
        return;
    var color=0x2194ce;
    //var material = new THREE.MeshBasicMaterial({color: color});
    //var material = new THREE.MeshBasicMaterial( { wireframe: true } );
    var material = null;
    if(node.children.length>0)
        material = new THREE.MeshPhongMaterial(
            {color: 0x000000,shininess:80, transparent: true, opacity: 0.1});
        //material = new THREE.MeshBasicMaterial( {color:0x000000, wireframe: true , transparent: true, opacity: 0.2} );
    else
        material = new THREE.MeshPhongMaterial(
            {color: color,shininess:80});

    material.emissive.setHex(color);
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
    InitScene();
    InitLight();
    scene.add(root);
    render.clear(); 
    Animate();
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
}
function PickObject()
{
    if(mouse.x<0 || mouse.y<0)
        return;
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

