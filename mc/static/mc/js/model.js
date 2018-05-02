$(document).ready(function () {
    ThreeDisplay.geometry_map.set('box',BoxGeometry);
    ThreeDisplay.geometry_map.set('cone',ConeGeometry);
    ThreeDisplay.geometry_map.set('tube',TubeGeometry);
    ThreeDisplay.geometry_map.set('sphere',SphereGeometry);
    ThreeDisplay.geometry_map.set('para',ParaGeometry);
    ThreeDisplay.geometry_map.set('trap',TrapGeometry);
    ThreeDisplay.geometry_map.set('ellipsoid',EllipsoidGeometry);
});

function BoxGeometry(parameter,scale)
{
    geometry = new THREE.BoxGeometry(parameter.x*UnitOf(parameter.lunit)*scale, 
        parameter.y*UnitOf(parameter.lunit)*scale, 
        parameter.z*UnitOf(parameter.lunit)*scale);
    return geometry;
}
//function ConeGeometry(z,rmin1,rmax1,rmin2,rmax2,start_phi=0,delta_phi=360)
function ConeGeometry(parameter,scale)
{
    var z = parameter.z*UnitOf(parameter.lunit)*scale;
    var rmin1 = parameter.rmin1*UnitOf(parameter.lunit)*scale;
    var rmax1 = parameter.rmax1*UnitOf(parameter.lunit)*scale;
    var rmin2 = parameter.rmin2*UnitOf(parameter.lunit)*scale;
    var rmax2 = parameter.rmax2*UnitOf(parameter.lunit)*scale;
    var start_phi= parameter.startphi*UnitOf(parameter.aunit)/UnitOf('deg');
    var delta_phi= parameter.deltaphi*UnitOf(parameter.aunit)/UnitOf('deg');

    delta_phi=Math.min(delta_phi,360);
    delta_phi=Math.PI*delta_phi/180;

    start_phi=Math.min(start_phi,360);
    start_phi=Math.PI*start_phi/180;

    var step = Math.PI/10;

    var segments=parseInt(delta_phi/step);
    segments=Math.max(2,segments);

    step = delta_phi/segments;
    var z_arr= new Array();
    var z_seg=10;
    var z_step=z/z_seg;
    for(var i=0;i <=z_seg; i++)
    {
        z_arr.push(-z/2.0+i*z_step);
    }

 	var geometry = new THREE.Geometry();

    var r_min_step=(rmin2-rmin1)/z_seg;
    var r_max_step=(rmax2-rmax1)/z_seg;
    for(var k=0;k<z_arr.length;k++)
    {
        var rmin=k*r_min_step+rmin1;
        var rmax=k*r_max_step+rmax1;
        for(var i=0; i<= segments; i++)
        {
            geometry.vertices.push( new THREE.Vector3( 
                rmin*Math.cos(start_phi+i*step),
                rmin*Math.sin(start_phi+i*step),
                z_arr[k]) );

            geometry.vertices.push( new THREE.Vector3( 
                rmax*Math.cos(start_phi+i*step),
                rmax*Math.sin(start_phi+i*step),
                z_arr[k]) );

        }
    }

    var is_close=false;
    if(delta_phi == Math.PI*2)
        is_close=true;
    return CalcFaces(geometry, z_seg, segments, is_close);
}

//function TubeGeometry(rmin,rmax,z,start_phi=0,delta_phi=360)
function TubeGeometry(parameter,scale)
{
    var rmin=         parameter.rmin*UnitOf(parameter.lunit)*scale;              
	var rmax=         parameter.rmax*UnitOf(parameter.lunit)*scale;              
	var z=            parameter.z*UnitOf(parameter.lunit)*scale;                 
	var start_phi=  parameter.startphi*UnitOf(parameter.aunit)/UnitOf('deg');  
	var delta_phi=parameter.deltaphi*UnitOf(parameter.aunit)/UnitOf('deg'); 

    delta_phi=Math.min(delta_phi,360);
    delta_phi=Math.PI*delta_phi/180;

    start_phi=Math.min(start_phi,360);
    start_phi=Math.PI*start_phi/180;

    var step = Math.PI/10;

    var segments=parseInt(delta_phi/step);
    segments=Math.max(2,segments);

    step = delta_phi/segments;
    var z_arr= new Array();
    z_arr.push(-z/2.0);
    z_arr.push(z/2.0);

 	var geometry = new THREE.Geometry();

    for(var k=0;k<z_arr.length;k++)
    {
        for(var i=0; i<= segments; i++)
        {
            geometry.vertices.push( new THREE.Vector3( 
                rmin*Math.cos(start_phi+i*step),
                rmin*Math.sin(start_phi+i*step),
                z_arr[k]) );

            geometry.vertices.push( new THREE.Vector3( 
                rmax*Math.cos(start_phi+i*step),
                rmax*Math.sin(start_phi+i*step),
                z_arr[k]) );

        }
    }

    var is_close=false;
    if(delta_phi == Math.PI*2)
        is_close=true;
    return CalcFaces(geometry, 1, segments, is_close);
}

//function SphereGeometry(rmin,rmax,start_theta=0,delta_theta=180,start_phi=0,delta_phi=360)
function SphereGeometry(parameter,scale)
{
    var rmin        = parameter.rmin*UnitOf(parameter.lunit)*scale;               
	var rmax        = parameter.rmax*UnitOf(parameter.lunit)*scale;               
	var start_theta = parameter.starttheta*UnitOf(parameter.aunit)/UnitOf('deg'); 
	var delta_theta = parameter.deltatheta*UnitOf(parameter.aunit)/UnitOf('deg'); 
	var start_phi   = parameter.startphi*UnitOf(parameter.aunit)/UnitOf('deg');   
	var delta_phi   = parameter.deltaphi*UnitOf(parameter.aunit)/UnitOf('deg');   

    delta_phi=Math.min(delta_phi,360);
    delta_phi=Math.PI*delta_phi/180;

    start_phi=Math.min(start_phi,360);
    start_phi=Math.PI*start_phi/180;

    delta_theta=Math.min(delta_theta,180);
    delta_theta=Math.PI*delta_theta/180;

    start_theta=Math.min(start_theta,180);
    start_theta=Math.PI*start_theta/180;

    var step_theta=Math.PI/10;
    var step_phi=Math.PI/10;

    var segments_phi=parseInt(delta_phi/step_phi);
    var segments_theta=parseInt(delta_theta/step_theta);
    segments_phi=Math.max(2,segments_phi);
    segments_theta=Math.max(2,segments_theta);

    step_theta=delta_theta/segments_theta;
    step_phi=delta_phi/segments_phi;

 	var geometry = new THREE.Geometry();

    for(var k=segments_theta;k>=0;k--)
    {
        for(var i=0; i<= segments_phi; i++)
        {
            geometry.vertices.push( new THREE.Vector3( 
                rmin*Math.sin(start_theta+k*step_theta)*Math.cos(start_phi+i*step_phi),
                rmin*Math.sin(start_theta+k*step_theta)*Math.sin(start_phi+i*step_phi),
                rmin*Math.cos(start_theta+k*step_theta)));

            geometry.vertices.push( new THREE.Vector3( 
                rmax*Math.sin(start_theta+k*step_theta)*Math.cos(start_phi+i*step_phi),
                rmax*Math.sin(start_theta+k*step_theta)*Math.sin(start_phi+i*step_phi),
                rmax*Math.cos(start_theta+k*step_theta)));
        }
    }

    var is_close=false;
    if(delta_phi == Math.PI*2)
        is_close=true;
    return CalcFaces(geometry, segments_theta, segments_phi, is_close);
}

function CalcFaces(geometry,segments_theta,segments_phi,is_close)
{
    for(var i=0; i<segments_phi; i++)
    {
        //lower face
        geometry.faces.push( new THREE.Face3( 2*i, 2*i+2, 2*i+1) );
        geometry.faces.push( new THREE.Face3( 2*i+1, 2*i+2, 2*i+3) );

        //upper face
        geometry.faces.push( new THREE.Face3( 
            (segments_phi+1)*2*segments_theta + 2*i, (segments_phi+1)*2*segments_theta + 2*i+1, (segments_phi+1)*2*segments_theta + 2*i+2));
        geometry.faces.push( new THREE.Face3( 
            (segments_phi+1)*2*segments_theta + 2*i+1, (segments_phi+1)*2*segments_theta + 2*i+3, (segments_phi+1)*2*segments_theta + 2*i+2 ) );
    }

    for(var k=0; k<segments_theta; k++)
    {
        var theta_layer=(segments_phi+1)*2*k;
        for(var i=0; i<segments_phi; i++)
        {
            //inner face
            geometry.faces.push( new THREE.Face3( 
                theta_layer+2*i+2, theta_layer+2*i, theta_layer+(segments_phi+1)*2 + 2*i) );
            geometry.faces.push( new THREE.Face3( 
                theta_layer+2*i+2, theta_layer+(segments_phi+1)*2 + 2*i, theta_layer+(segments_phi+1)*2 + 2*i+2) );

            //
            //outer face
            geometry.faces.push( new THREE.Face3( 
                theta_layer+2*i+1, theta_layer+2*i+3, theta_layer+(segments_phi+1)*2 + 2*i+1) );
            geometry.faces.push( new THREE.Face3( 
                theta_layer+2*i+3, theta_layer+(segments_phi+1)*2 + 2*i+3, theta_layer+(segments_phi+1)*2 + 2*i+1) );
        }

        //egde
        if(!is_close)
        {
            geometry.faces.push( new THREE.Face3( 
                theta_layer+0, theta_layer+1, theta_layer+(segments_phi+1)*2) );
            geometry.faces.push( new THREE.Face3( 
                theta_layer+1, theta_layer+(segments_phi+1)*2+1, theta_layer+(segments_phi+1)*2));

            geometry.faces.push( new THREE.Face3( 
                theta_layer+2*segments_phi+1, theta_layer+2*segments_phi, theta_layer+(segments_phi+1)*2 + 2*segments_phi) );
            geometry.faces.push( new THREE.Face3( 
                theta_layer+2*segments_phi+1, theta_layer+(segments_phi+1)*2 + 2*segments_phi, theta_layer+(segments_phi+1)*2 + 2*segments_phi +1) );
        }
    }

    //geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
}

//function ParaGeometry(x, y, z, alpha, theta, phi)
function ParaGeometry(parameter,scale)
{
    var  x     = parameter.x*UnitOf(parameter.lunit)*scale;            
	var  y     = parameter.y*UnitOf(parameter.lunit)*scale;            
	var  z     = parameter.z*UnitOf(parameter.lunit)*scale;            
	var  alpha = parameter.alpha*UnitOf(parameter.aunit)/UnitOf('deg');
	var  theta = parameter.theta*UnitOf(parameter.aunit)/UnitOf('deg');
	var  phi   = parameter.phi*UnitOf(parameter.aunit)/UnitOf('deg');  

    var fDx = x/2;
    var fDy = y/2;
    var fDz = z/2;
    
    alpha=Math.min(alpha,360);
    alpha=Math.PI*alpha/180;

    theta=Math.min(theta,360);
    theta=Math.PI*theta/180;

    phi=Math.min(phi,180);
    phi=Math.PI*phi/180;

    var fTalpha = Math.tan(alpha);
    var fTthetaCphi = Math.tan(theta)*Math.cos(phi);
    var fTthetaSphi = Math.tan(theta)*Math.sin(phi);

 	var geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3(-fDz*fTthetaCphi-fDy*fTalpha-fDx, -fDz*fTthetaSphi-fDy, -fDz));
    geometry.vertices.push( new THREE.Vector3(-fDz*fTthetaCphi-fDy*fTalpha+fDx, -fDz*fTthetaSphi-fDy, -fDz));
    geometry.vertices.push( new THREE.Vector3(-fDz*fTthetaCphi+fDy*fTalpha-fDx, -fDz*fTthetaSphi+fDy, -fDz));
    geometry.vertices.push( new THREE.Vector3(-fDz*fTthetaCphi+fDy*fTalpha+fDx, -fDz*fTthetaSphi+fDy, -fDz));
    geometry.vertices.push( new THREE.Vector3(+fDz*fTthetaCphi-fDy*fTalpha-fDx, +fDz*fTthetaSphi-fDy, +fDz));
    geometry.vertices.push( new THREE.Vector3(+fDz*fTthetaCphi-fDy*fTalpha+fDx, +fDz*fTthetaSphi-fDy, +fDz));
    geometry.vertices.push( new THREE.Vector3(+fDz*fTthetaCphi+fDy*fTalpha-fDx, +fDz*fTthetaSphi+fDy, +fDz));
    geometry.vertices.push( new THREE.Vector3(+fDz*fTthetaCphi+fDy*fTalpha+fDx, +fDz*fTthetaSphi+fDy, +fDz));

    geometry.faces.push( new THREE.Face3(0,2,1) );
    geometry.faces.push( new THREE.Face3(2,3,1) );

    geometry.faces.push( new THREE.Face3(4,5,6) );
    geometry.faces.push( new THREE.Face3(5,7,6) );

    geometry.faces.push( new THREE.Face3(0,1,4) );
    geometry.faces.push( new THREE.Face3(1,5,4) );

    geometry.faces.push( new THREE.Face3(2,6,7) );
    geometry.faces.push( new THREE.Face3(7,3,2) );

    geometry.faces.push( new THREE.Face3(0,4,2) );
    geometry.faces.push( new THREE.Face3(4,6,2) );

    geometry.faces.push( new THREE.Face3(1,3,7) );
    geometry.faces.push( new THREE.Face3(7,5,1) );

    return geometry;

}

/*
function CalcFacesHexahedron(geometry,segments_theta,segments_phi,is_close)
{

}

THREE.Face4=function(i,j,k,n)
{

}
function mode_test(func,parameter)
{
var scale =1;
var geo=func(parameter,scale);
var mat = new THREE.MeshPhongMaterial({color: 0x2194ce,shininess:80});
var mat = new THREE.MeshBasicMaterial( {color:0x000000, wireframe: true} );

//mat.emissive.setHex( 0xff0000 );
var obj = new THREE.Mesh(geo, mat);
while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
}
scene.add(obj);
var bbox = new THREE.Box3().setFromObject(obj);
DrawAxis(bbox,scale,parameter.lunit);
}
*/
/*
parameter:{
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
	lunit: 'cm',
	aunit: 'deg'
}
*/
function TrapGeometry(parameter,scale)
{
	var  theta = parameter.theta*UnitOf(parameter.aunit)/UnitOf('deg');
	var  phi   = parameter.phi*UnitOf(parameter.aunit)/UnitOf('deg');
	var  alpha1 = parameter.alpha1*UnitOf(parameter.aunit)/UnitOf('deg');
	var  alpha2 = parameter.alpha2*UnitOf(parameter.aunit)/UnitOf('deg');

    theta=Math.min(theta*Math.PI/180,Math.PI*2);
    phi=Math.min(phi*Math.PI/180,Math.PI*2);
    alpha1=Math.min(alpha1*Math.PI/180,Math.PI*2);
    alpha2=Math.min(alpha2*Math.PI/180,Math.PI*2);
    		
  	var fDz=parameter.z*UnitOf(parameter.lunit)*scale/2;
  	var fTthetaCphi=Math.tan(theta)*Math.cos(phi);
  	var fTthetaSphi=Math.tan(theta)*Math.sin(phi);

  	var fDy1=parameter.y1*UnitOf(parameter.lunit)*scale/2;
  	var fDx1=parameter.x1*UnitOf(parameter.lunit)*scale/2;
  	var fDx2=parameter.x2*UnitOf(parameter.lunit)*scale/2;
  	var fTalpha1=Math.tan(alpha1);

  	var fDy2=parameter.y2*UnitOf(parameter.lunit)*scale/2;
  	var fDx3=parameter.x3*UnitOf(parameter.lunit)*scale/2;
  	var fDx4=parameter.x4*UnitOf(parameter.lunit)*scale/2;
  	var fTalpha2=Math.tan(alpha2);

 	var geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3(-fDz*fTthetaCphi-fDy1*fTalpha1-fDx1, -fDz*fTthetaSphi-fDy1,-fDz));
    geometry.vertices.push( new THREE.Vector3(-fDz*fTthetaCphi-fDy1*fTalpha1+fDx1, -fDz*fTthetaSphi-fDy1,-fDz));
    geometry.vertices.push( new THREE.Vector3(-fDz*fTthetaCphi+fDy1*fTalpha1-fDx2, -fDz*fTthetaSphi+fDy1,-fDz));
    geometry.vertices.push( new THREE.Vector3(-fDz*fTthetaCphi+fDy1*fTalpha1+fDx2, -fDz*fTthetaSphi+fDy1,-fDz));
    geometry.vertices.push( new THREE.Vector3(+fDz*fTthetaCphi-fDy2*fTalpha2-fDx3, +fDz*fTthetaSphi-fDy2,+fDz));
    geometry.vertices.push( new THREE.Vector3(+fDz*fTthetaCphi-fDy2*fTalpha2+fDx3, +fDz*fTthetaSphi-fDy2,+fDz));
    geometry.vertices.push( new THREE.Vector3(+fDz*fTthetaCphi+fDy2*fTalpha2-fDx4, +fDz*fTthetaSphi+fDy2,+fDz));
    geometry.vertices.push( new THREE.Vector3(+fDz*fTthetaCphi+fDy2*fTalpha2+fDx4, +fDz*fTthetaSphi+fDy2,+fDz));

    geometry.faces.push( new THREE.Face3(0,2,1) );
    geometry.faces.push( new THREE.Face3(2,3,1) );

    geometry.faces.push( new THREE.Face3(4,5,6) );
    geometry.faces.push( new THREE.Face3(5,7,6) );

    geometry.faces.push( new THREE.Face3(0,1,4) );
    geometry.faces.push( new THREE.Face3(1,5,4) );

    geometry.faces.push( new THREE.Face3(2,6,7) );
    geometry.faces.push( new THREE.Face3(7,3,2) );

    geometry.faces.push( new THREE.Face3(0,4,2) );
    geometry.faces.push( new THREE.Face3(4,6,2) );

    geometry.faces.push( new THREE.Face3(1,3,7) );
    geometry.faces.push( new THREE.Face3(7,5,1) );

    return geometry;

}

/*
parameter:{
	ax: 10,
	by: 20,
	cz: 50,
	zcut1: -10,
	zcut2: 40,
	lunit: 'mm',
}
*/
function EllipsoidGeometry(parameter,scale)
{
	/*
	Ellipsoid:
	1=x**2/a**2+y**2/b**2+z**2/c**2
	1-z**2/c**2=x**2/a**2 + y**2/b**2
	let x**2=x'**2 * a**2 * (c**2-z**2)/c**2, y**2=y'**2 * b**2 * (c**2 - z**2)/c**2
	then 1=x'**2 + y'**2
	*/

    var ax = parameter.ax*UnitOf(parameter.lunit)*scale;              
	var by = parameter.by*UnitOf(parameter.lunit)*scale;              
	var cz=  parameter.cz*UnitOf(parameter.lunit)*scale; 
	var zcut1=  parameter.zcut1*UnitOf(parameter.lunit)*scale;                 
 	var zcut2=  parameter.zcut2*UnitOf(parameter.lunit)*scale;                 

    var zcut1=Math.max(zcut1,-cz);
    var zcut2=Math.min(zcut2,cz);
	if(zcut1>=zcut2)
	{
		zcut1=-cz;
		zcut2=cz;
	}

    var segments_theta=18;
    var start_theta=Math.acos(-zcut1/cz);
    var stop_theta=Math.acos(-zcut2/cz);
   
    var step_theta=(stop_theta-start_theta)/18;
              
	var start_phi=0;  
	var delta_phi=2*Math.PI;
    var segments_phi=36;
    var step_phi=delta_phi/segments_phi;

 	var geometry = new THREE.Geometry();

    for(var k=0;k<=segments_theta;k++)
    {
    	var z=-Math.cos(k*step_theta+start_theta)*cz;
    	var coef=Math.sqrt(cz*cz - z*z)/cz;
        for(var i=0; i<= segments_phi; i++)
        {
        	var phi=start_phi+i*step_phi;

            geometry.vertices.push( new THREE.Vector3(0,0,z));

            geometry.vertices.push( new THREE.Vector3(coef*ax*Math.cos(phi),coef*ax*Math.sin(phi),z));
        }
    }

    return CalcFaces(geometry, segments_theta, segments_phi, true);
}

