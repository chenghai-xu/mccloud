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
}
function InitRender() {
   render=new THREE.WebGLRenderer({antialias:true});
   render.setSize(width, height );
   render.setClearColor(0x000000, 1.0);
   document.getElementById('3d_canvas').appendChild(render.domElement);
}
function InitControls() {
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 4.0;
    controls.zoomSpeed = 4.0;
    controls.panSpeed = 2;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 1.0;
    controls.keys = [ 65, 83, 68 ];
    //controls.addEventListener( 'change', render );
}

function InitCamera() { 
    camera = new THREE.PerspectiveCamera( 45, width / height , 1 , 5000 );
    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 100;
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.lookAt( {x:0, y:0, z:0 } );
}

function InitScene() {   
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x000000 );
}

function InitLight() { 
    light = new THREE.DirectionalLight(0xff0000, 1.0, 0);
    light.position.set(0, 0, -200);
    scene.add(light);
}

function Animate() {
    requestAnimationFrame(Animate);
    controls.update();
	render.render(scene, camera);
}

function DrawModel(current)
{
    var solid=current.data.solid;
    if(solid.type=='box')
    {
        var geometry = new THREE.BoxGeometry(solid.parameter.x*10, solid.parameter.y*10, solid.parameter.z*10 );
    }
    else
        return;
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    var obj = new THREE.Mesh( geometry, material );
    InitScene();
    InitLight();
    scene.add(obj);
    render.clear(); 
    Animate();
}
