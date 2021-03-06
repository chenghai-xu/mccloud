$(document).ready(function () {
   InitDisplay3D(); 
});

var ThreeDisplay = {};
var scene, camera, render;
//var geometry, material, mesh;
var width=600;
var height=480;
var light;
var controls;
var default_font;
var show_in_parent=true;
var daxis={
    x:20,
    y:20,
    z:20,
    unit:'cm',
};
var first_show=true;
function ConfigCamera(bbox)
{
    if(!first_show)
    {
        return;
    }

    camera.position.x = (bbox.min.x - bbox.max.x)*2;
    camera.position.y = (bbox.min.y - bbox.max.y)*2;
    camera.position.z = (bbox.min.z - bbox.max.z)*2; 
    first_show=false;   
}

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
    camera = new THREE.PerspectiveCamera( 70, width / height , 1 , 50000 );
    camera.position.x = -50;
    camera.position.y = -50;
    camera.position.z = -50;
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

ThreeDisplay.geometry_map = new Map();
ThreeDisplay.CalcGeometry = function(solid,scale)
{
    var fun = this.geometry_map.get(solid.type);
    if(fun == undefined)
        return null;
    return fun(solid.parameter,scale);
};

function GetBBox(solid)
{
    var geometry = ThreeDisplay.CalcGeometry(solid,1.0);
    var mat = new THREE.MeshBasicMaterial( {color:0x000000, wireframe: true} );
    var mesh = new THREE.Mesh(geometry, mat);
    var bbox = new THREE.Box3().setFromObject(mesh);
    return bbox;
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
    var bbox = GetBBox(solid);
    var size = Math.min(bbox.max.x-bbox.min.x,bbox.max.y-bbox.min.y);
    size = Math.min(size,bbox.max.z-bbox.min.z);
    var scale = 2000/size;

    var geometry = ThreeDisplay.CalcGeometry(solid,scale);
    if(geometry==null)
        return;

    var color=0x2194ce;
    var material=null;
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
        var geo=ThreeDisplay.CalcGeometry(child.data.solid,scale);
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
            var lunit=UnitOf(pos.lunit)*scale;
            var aunit=UnitOf(rot.aunit)/UnitOf('deg')*Math.PI/180;
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
    bbox = new THREE.Box3().setFromObject(root);
    DrawAxis(bbox,scale,solid.parameter.lunit);
	ConfigCamera(bbox);
    render.clear(); 
    //Animate();
    return scale;
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

function DrawAxis(bbox,scale,lunit='cm')
{
    scale=scale*UnitOf('cm');
    var txt_size=(bbox.max.x-bbox.min.x)/10;
    txt_size=Math.min(txt_size,(bbox.max.y-bbox.min.y)/10);
    txt_size=Math.min(txt_size,(bbox.max.z-bbox.min.z)/10);

    var txt_height=txt_size/3;
    var txt_font = {
        font:default_font, 
        size:txt_size,
        height: txt_height};
    var geo_x = new THREE.Geometry();
    geo_x.vertices.push( new THREE.Vector3( bbox.min.x, 0, 0 ));
    geo_x.vertices.push( new THREE.Vector3( bbox.max.x, 0, 0 ) );
    var mat_x =  new THREE.LineBasicMaterial( { color: 0xff0000} );
    var axis_x = new THREE.Line( geo_x, mat_x);
    var group_x = new THREE.Group();

    var text=(bbox.max.x/scale).toFixed(2)+lunit+'(X)';
    var labe_x = new THREE.TextGeometry(text,txt_font);
    var mesh_x = new THREE.Mesh(labe_x,mat_x);
    mesh_x.position.x = bbox.max.x+txt_size*2;
    mesh_x.position.y = -txt_height/2;

    text=(bbox.min.x/scale).toFixed(2);
    var labe_x1 = new THREE.TextGeometry(text,txt_font);
    var mesh_x1 = new THREE.Mesh(labe_x1,mat_x);
    mesh_x1.position.x = bbox.min.x-txt_size*4;
    mesh_x1.position.y = -txt_height/2;

    group_x.add(axis_x);
    group_x.add(mesh_x);
    group_x.add(mesh_x1);

    var geo_y = new THREE.Geometry();
    geo_y.vertices.push( new THREE.Vector3( 0, bbox.min.y, 0 ));
    geo_y.vertices.push( new THREE.Vector3( 0, bbox.max.y, 0 ) );
    var mat_y = new THREE.LineBasicMaterial( { color: 0x00ff00} );
    //mat_y.emissive.setHex(0x00ff00);
    var axis_y = new THREE.Line( geo_y, mat_y);
    var group_y = new THREE.Group();

    text=(bbox.max.y/scale).toFixed(2)+lunit+'(Y)';
    var labe_y = new THREE.TextGeometry(text,txt_font);
    var mesh_y = new THREE.Mesh(labe_y,mat_y);
    mesh_y.position.y = bbox.max.y+txt_size;
    mesh_y.position.x = -text.length*txt_size/4;

    text=(bbox.min.y/scale).toFixed(2);
    var labe_y1 = new THREE.TextGeometry(text,txt_font);
    var mesh_y1 = new THREE.Mesh(labe_y1,mat_y);
    mesh_y1.position.y = bbox.min.y-txt_size;
    mesh_y1.position.x = -text.length*txt_size/4;

    group_y.add(axis_y);
    group_y.add(mesh_y);
    group_y.add(mesh_y1);

    var geo_z = new THREE.Geometry();
    geo_z.vertices.push( new THREE.Vector3( 0, 0, bbox.min.z));
    geo_z.vertices.push( new THREE.Vector3( 0, 0, bbox.max.z) );
    var mat_z = new THREE.LineBasicMaterial( { color: 0x0000ff} );
    //mat_z.emissive.setHex(0x0000ff);
    var axis_z = new THREE.Line( geo_z, mat_z);
    var group_z = new THREE.Group();

    text=(bbox.max.z/scale).toFixed(2)+lunit+'(Z)';
    var labe_z = new THREE.TextGeometry(text,txt_font);
    var mesh_z = new THREE.Mesh(labe_z,mat_z);
    mesh_z.position.z = bbox.max.z+txt_size;
    mesh_z.position.x = -text.length*txt_size/4;

    text=(bbox.min.z/scale).toFixed(2);
    var labe_z1 = new THREE.TextGeometry(text,txt_font);
    var mesh_z1 = new THREE.Mesh(labe_z1,mat_z);
    mesh_z1.position.z = bbox.min.z-txt_size;
    mesh_z1.position.x = -text.length*txt_size/4;
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
        default_font=f;
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

