$(document).ready(function () {
});

function TubeGeometry(rmin,rmax,z,start_phi=0,delta_phi=Math.PI*2)
{
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

    for(var i=0; i<segments; i++)
    {
        //lower face
        geometry.faces.push( new THREE.Face3( 2*i, 2*i+2, 2*i+1) );
        geometry.faces.push( new THREE.Face3( 2*i+1, 2*i+2, 2*i+3) );

        //upper face
        geometry.faces.push( new THREE.Face3( 
            (segments+1)*2 + 2*i, (segments+1)*2 + 2*i+1, (segments+1)*2 + 2*i+2));
        geometry.faces.push( new THREE.Face3( 
            (segments+1)*2 + 2*i+1, (segments+1)*2 + 2*i+3, (segments+1)*2 + 2*i+2 ) );

        //inner face
        geometry.faces.push( new THREE.Face3( 
            2*i+2, 2*i, (segments+1)*2 + 2*i) );
        geometry.faces.push( new THREE.Face3( 
            2*i+2, (segments+1)*2 + 2*i, (segments+1)*2 + 2*i+2) );

        //
        //outer face
        geometry.faces.push( new THREE.Face3( 
            2*i+1, 2*i+3, (segments+1)*2 + 2*i+1) );
        geometry.faces.push( new THREE.Face3( 
            2*i+3, (segments+1)*2 + 2*i+3, (segments+1)*2 + 2*i+1) );
    }

    if(delta_phi != Math.PI*2)
    {
        geometry.faces.push( new THREE.Face3( 
            0, 1, (segments+1)*2) );
        geometry.faces.push( new THREE.Face3( 
            1, (segments+1)*2+1, (segments+1)*2));

        geometry.faces.push( new THREE.Face3( 
            2*segments+1, 2*segments, (segments+1)*2 + 2*segments) );
        geometry.faces.push( new THREE.Face3( 
            2*segments+1, (segments+1)*2 + 2*segments, (segments+1)*2 + 2*segments +1) );
    }

    //geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
}

function SphereGeometry(rmin,rmax,start_theta=0,delta_theta=Math.PI,start_phi=0,delta_phi=Math.PI*2)
{
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

    segments_theta=4;
    segments_phi=4;

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
        if(delta_phi != Math.PI*2)
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
