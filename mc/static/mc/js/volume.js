$(document).ready(function () {
});

function ChangeVolumeName(form){
    var name=$(form).val();
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'physical')
        return;
    instance.rename_node(current,name);
} 
function SelectedPhysical(current)
{
    if(current.type != 'physical')
        return;
    var property = $('#property-physical').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    $(property).find('select[name=solid]').val(current.data.solid.type);
    $(property).find('input[name=name]').val(current.text);
    if(current.text=='world' ||current.text=='parallel' )
        $(property).find('input[name=name]').attr("disabled","disabled");
    if(current.text!='world' && current.text!='parallel' )
        $(property).find('select[name=placement]').val(current.data.placement.type);
    $(property).find('input[name=material]').val(current.data.material);

    $('#property-container').append(property);
    DrawModel(current);
}

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
    DrawModel(par);
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
    else if(solid.type=='sphere')
    {
        wigdet = $('#property-solid-sphere').clone();
        InitSphereForm(wigdet,solid);
    }
    else 
        return;


    $(wigdet).find('select[name=solid]').val(solid.type);
    wigdet.attr("id","property-detail-current");
    wigdet.removeClass('hidden');
    $('#property-detail-current').remove();
    $('#property-detail-container').append(wigdet);
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
    DrawModel(current);
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
    DrawModel(current);
}

function InitPlacementSimpleForm(wigdet,placement)
{
    $(wigdet).find('input[name=px]').val(placement.position.x);
    $(wigdet).find('input[name=py]').val(placement.position.y);
    $(wigdet).find('input[name=pz]').val(placement.position.z);
    $(wigdet).find('select[name=lunit]').val(placement.position.lunit);
    $(wigdet).find('input[name=rx]').val(placement.rotation.x);
    $(wigdet).find('input[name=ry]').val(placement.rotation.y);
    $(wigdet).find('input[name=rz]').val(placement.rotation.z);
    $(wigdet).find('select[name=aunit]').val(placement.rotation.aunit);
}

