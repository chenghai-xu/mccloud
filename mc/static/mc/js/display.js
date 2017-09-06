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
   render.setClearColor(0xffffff, 1.0);
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
    scene.background = new THREE.Color( 0xffffff );
}

function InitLight() { 
    light = new THREE.DirectionalLight(0xffffff, 1.0, 0);
    light.position.set(-200, -200, -200);
    scene.add(light);
    var amb = new THREE.AmbientLight( 0x404040 ); // soft white light
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
            {color: color,shininess:80, transparent: true, opacity: 0.1});
    else
        material = new THREE.MeshPhongMaterial(
            {color: color,shininess:80});


    var root = new THREE.Mesh(geometry, material);
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
            geo.translate(pos.x,pos.y,pos.z); 
            geo.rotateX(rot.x);
            geo.rotateY(rot.y);
            geo.rotateZ(rot.z);
            color = color + 20;
            //var mat = new THREE.MeshBasicMaterial({color: color});
            var mat = new THREE.MeshPhongMaterial({color: color,shininess:80});
            var obj = new THREE.Mesh(geo, mat);
            root.add(obj);
        }
    }
    InitScene();
    InitLight();
    scene.add(root);
    render.clear(); 
    Animate();
}
