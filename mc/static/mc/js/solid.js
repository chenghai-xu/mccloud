$(document).ready(function () {
});

function OnBoxSubmit(form){
    var box=NewSolid('box');
    box.parameter.x=$(form).find('input[name=x]').val();
    box.parameter.y=$(form).find('input[name=y]').val();
    box.parameter.z=$(form).find('input[name=z]').val();
    box.parameter.lunit=$(form).find('select[name=lunit]').val();

    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'volume')
        return;
    current.data.solid=box;
    DrawModel(current);
}

function InitBoxForm(wigdet,box)
{
    $(wigdet).find('input[name=x]').val(box.parameter.x);
    $(wigdet).find('input[name=y]').val(box.parameter.y);
    $(wigdet).find('input[name=z]').val(box.parameter.z);
    $(wigdet).find('select[name=lunit]').val(box.parameter.lunit);
}

function InitTubeForm(wigdet,tube)
{
    $(wigdet).find('input[name=rmin]').val(tube.parameter.rmin);
    $(wigdet).find('input[name=rmax]').val(tube.parameter.rmax);
    $(wigdet).find('input[name=z]').val(tube.parameter.z);
    $(wigdet).find('input[name=startphi]').val(tube.parameter.startphi);
    $(wigdet).find('input[name=deltaphi]').val(tube.parameter.deltaphi);
    $(wigdet).find('select[name=lunit]').val(tube.parameter.lunit);
    $(wigdet).find('select[name=aunit]').val(tube.parameter.aunit);
}

function OnTubeSubmit(form){
    var tube=NewSolid('tube');
    tube.parameter.rmin=$(form).find('input[name=rmin]').val();
    tube.parameter.rmax=$(form).find('input[name=rmax]').val();
    tube.parameter.z=$(form).find('input[name=z]').val();
    tube.parameter.startphi=$(form).find('input[name=startphi]').val();
    tube.parameter.deltaphi=$(form).find('input[name=deltaphi]').val();
    tube.parameter.lunit=$(form).find('select[name=lunit]').val();
    tube.parameter.aunit=$(form).find('select[name=aunit]').val();

    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'volume')
        return;
    current.data.solid=tube;
    DrawModel(current);
}

function InitSphereForm(wigdet,sphere)
{
    $(wigdet).find('input[name=rmin]').val(sphere.parameter.rmin);
    $(wigdet).find('input[name=rmax]').val(sphere.parameter.rmax);
    $(wigdet).find('input[name=starttheta]').val(sphere.parameter.starttheta);
    $(wigdet).find('input[name=deltatheta]').val(sphere.parameter.deltatheta);
    $(wigdet).find('input[name=startphi]').val(sphere.parameter.startphi);
    $(wigdet).find('input[name=deltaphi]').val(sphere.parameter.deltaphi);
    $(wigdet).find('select[name=lunit]').val(sphere.parameter.lunit);
    $(wigdet).find('select[name=aunit]').val(sphere.parameter.aunit);
}

function OnSphereSubmit(form){
    var sphere=NewSolid('sphere');
    sphere.parameter.rmin=$(form).find('input[name=rmin]').val();
    sphere.parameter.rmax=$(form).find('input[name=rmax]').val();
    sphere.parameter.starttheta=$(form).find('input[name=starttheta]').val();
    sphere.parameter.deltatheta=$(form).find('input[name=deltatheta]').val();
    sphere.parameter.startphi=$(form).find('input[name=startphi]').val();
    sphere.parameter.deltaphi=$(form).find('input[name=deltaphi]').val();
    sphere.parameter.lunit=$(form).find('select[name=lunit]').val();
    sphere.parameter.aunit=$(form).find('select[name=aunit]').val();

    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'volume')
        return;
    current.data.solid=sphere;
    DrawModel(current);
}

