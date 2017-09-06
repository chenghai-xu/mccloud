$(document).ready(function () {
});

function PhysicalAdd(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'physical')
        return;

    var node = NewPhysicalNode('physical');
    var res = instance.create_node(current,node);
    console.log('create physical: ' + res);
} 

function PhysicalDelete(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'physical')
        return;

    var par = instance.get_node(instance.get_parent(current));
    if(par.type == 'geometry')
        return;

    var res = instance.delete_node(current);
    console.log('delete physical: ' + res);
} 
function InitSolidForm(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'physical')
        return;
    var solid=current.data.solid;
    var wigdet=null;
    if(solid.type=='box'){
        wigdet = $('#property-solid-box').clone();
        InitBoxForm(wigdet,solid);
    }
    else if(solid.type=='tube')
    {
        wigdet = $('#property-solid-tube').clone();
        InitTubeForm(wigdet,solid);
    }
    else 
        return;


    $(wigdet).find('select[name=solid]').val(solid.type);
    wigdet.attr("id","property-detail-current");
    wigdet.removeClass('hidden');
    $('#property-detail-current').remove();
    $('#property-detail-container').append(wigdet);
} 

function OnBoxSubmit(form){
    var box={type:'box',parameter:{}};
    box.parameter.x=$(form).find('input[name=x]').val();
    box.parameter.y=$(form).find('input[name=y]').val();
    box.parameter.z=$(form).find('input[name=z]').val();
    box.parameter.lunit=$(form).find('select[name=lunit]').val();

    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'physical')
        return;
    current.data.solid=box;
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

function ChangeSolidType(sel){
    var selected=$(sel).val();
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'physical')
        return;
    var solid=current.data.solid;
    if(selected==solid.type)
        return;
    current.data.solid=NewSolid(selected);
    InitSolidForm();
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
    if(current.type != 'physical')
        return;
    current.data.solid=tube;
}

function InitPlacementForm(wigdet,tube)
{
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'physical')
        return;
    var placement=current.data.placement;
    var wigdet=null;
    if(placement==undefined || placement.type!='simple'){
        return;
    }

    wigdet = $('#property-placement-simple').clone();
    InitPlacementSimpleForm(wigdet,placement);

    $(wigdet).find('select[name=placement]').val(placement.type);
    wigdet.attr("id","property-detail-current");
    wigdet.removeClass('hidden');
    $('#property-detail-current').remove();
    $('#property-detail-container').append(wigdet);
}

function OnPlacementSimpleSubmit(form){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'physical')
        return;

    var placement=current.data.placement;
    placement.position.x=$(form).find('input[name=px]').val();
    placement.position.y=$(form).find('input[name=py]').val();
    placement.position.z=$(form).find('input[name=pz]').val();
    placement.position.lunit=$(form).find('select[name=lunit]').val();
    placement.rotation.x=$(form).find('input[name=rx]').val();
    placement.rotation.y=$(form).find('input[name=ry]').val();
    placement.rotation.z=$(form).find('input[name=rz]').val();
    placement.rotation.aunit=$(form).find('select[name=aunit]').val();
    current.data.placement=placement;
}

function InitPlacementSimpleForm(wigdet,placement)
{
    $(wigdet).find('input[name=px]').val(placement.position.x);
    $(wigdet).find('input[name=py]').val(placement.position.y);
    $(wigdet).find('input[name=pz]').val(placement.position.z);
    $(wigdet).find('select[name=lunit]').val(placement.position.lunit);
    $(wigdet).find('input[name=rx]').val(placement.rotation.rx);
    $(wigdet).find('input[name=ry]').val(placement.rotation.ry);
    $(wigdet).find('input[name=rz]').val(placement.rotation.rz);
    $(wigdet).find('select[name=aunit]').val(placement.rotation.aunit);
}
