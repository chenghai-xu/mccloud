$(document).ready(function () {
});

function TubeGeometry(rmin,rmax,z,startphi=0,deltaphi=Math.PI*2,segments=20)
{
    var step = deltaphi/segments;
    var z_arr= new Array();
    z_arr.push(-z/2.0);
    z_arr.push(z/2.0);

 	var geometry = new THREE.Geometry();

    for(var k=0;k<z_arr.length;k++)
    {
        for(var i=0; i<= segments; i++)
        {
            geometry.vertices.push( new THREE.Vector3( 
                rmin*Math.cos(startphi+i*step),
                rmin*Math.sin(startphi+i*step),
                z_arr[k]) );

            geometry.vertices.push( new THREE.Vector3( 
                rmax*Math.cos(startphi+i*step),
                rmax*Math.sin(startphi+i*step),
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

    geometry.faces.push( new THREE.Face3( 
        0, 1, (segments+1)*2) );
    geometry.faces.push( new THREE.Face3( 
        1, (segments+1)*2+1, (segments+1)*2));

    geometry.faces.push( new THREE.Face3( 
        2*segments+1, 2*segments, (segments+1)*2 + 2*segments) );
    geometry.faces.push( new THREE.Face3( 
        2*segments+1, (segments+1)*2 + 2*segments, (segments+1)*2 + 2*segments +1) );

    //geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
}
