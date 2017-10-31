$(document).ready(function () {
});

function ChangeVolumeName(form){
    var name=$(form).val();
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'volume')
        return;
    instance.rename_node(current,name);
} 
function SelectedVolume(current)
{
    if(current.type != 'volume')
        return;
    var property = $('#property-volume').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');
    $(property).find('select[name=solid]').val(current.data.solid.type);
    $(property).find('input[name=name]').val(current.text);
    if(current.text=='world' ||current.text=='parallel' )
        $(property).find('input[name=name]').attr("disabled","disabled");
    if(current.text!='world' && current.text!='parallel' )
        $(property).find('select[name=placement]').val(current.data.placement.type);
    $(property).find('input[name=material]').val(current.data.material);

    if(current.text=='world' ||current.text=='parallel' )
    {
        property.find('#edit-detector').addClass('hidden');
        property.find('#delete-node').addClass('hidden');
    }
    var instance = $('#project-view').jstree(true);
    var par = instance.get_node(instance.get_parent(current));
    if(par.text == 'parallel')
    {
        property.find('#new-node').addClass('hidden');
        //property.find('#delete-node').addClass('hidden');
    }

    $('#property-container').append(property);
    DrawModel(current);
}

function VolumeAdd(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'volume')
        return;

    var node = NewVolumeNode('volume');
    var res = instance.create_node(current,node);
    console.log('create volume: ' + res);
} 

function VolumeDelete(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'volume')
        return;

    var par = instance.get_node(instance.get_parent(current));
    if(par.type == 'geometry')
        return;

    var res = instance.delete_node(current);
    console.log('delete volume: ' + res);
    DrawModel(par);
} 
function InitSolidForm(){
    var instance = $('#project-view').jstree(true);
    var selects=instance.get_selected(true);
    if(selects.length < 1)
        return;
    var current=selects[0];
    if(current.type != 'volume')
        return;
    var solid=current.data.solid;
    var wigdet=null;
    if(solid.type=='box'){
        wigdet = $('#property-solid-box').clone();
        //InitBoxForm(wigdet,solid);
        SolidBox.InitForm(wigdet,solid);
    }
    else if(solid.type=='tube')
    {
        wigdet = $('#property-solid-tube').clone();
        //InitTubeForm(wigdet,solid);
        SolidTube.InitForm(wigdet,solid);
    }
    else if(solid.type=='sphere')
    {
        wigdet = $('#property-solid-sphere').clone();
        //InitSphereForm(wigdet,solid);
        SolidSphere.InitForm(wigdet,solid);
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
    if(current.type != 'volume')
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
    if(current.type != 'volume')
        return;
    var placement=current.data.placement;
    var wigdet=null;
    if(placement==undefined || placement.type!='simple'){
        return;
    }

    wigdet = $('#property-placement-simple').clone();
    //InitPlacementSimpleForm(wigdet,placement);
    PlacementSimple.InitForm(wigdet,placement);

    $(wigdet).find('select[name=placement]').val(placement.type);
    wigdet.attr("id","property-detail-current");
    wigdet.removeClass('hidden');
    $('#property-detail-current').remove();
    $('#property-detail-container').append(wigdet);
}

var VolumeForm={
    EditDetector: function()
    {
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'volume')
            return;
        if(current.data.detector===undefined)
            current.data.detector=DetectorModel.NewSD();

        var par = instance.get_node(instance.get_parent(current));

        var opts=$('#sensitive-detector').find('select[name=type]');
        opts.empty();

        if(par.text=='world')
        {
            opts.append('<option>dist</option>');
        }
        else if(par.text=='parallel' )
        {
            opts.append('<option>mesh</option>');
        }
        else
        {
            opts.append('<option>dist</option>');
        }

        DetectorForm.InitForm(current.data.detector);
        DetectorForm.Open();
    },
};

var PlacementSimple = {
    InitForm: function(form, placement)
    {
        $(form).find('input[name=px]').val(placement.position.x);
        $(form).find('input[name=py]').val(placement.position.y);
        $(form).find('input[name=pz]').val(placement.position.z);
        $(form).find('select[name=lunit]').val(placement.position.lunit);
        $(form).find('input[name=rx]').val(placement.rotation.x);
        $(form).find('input[name=ry]').val(placement.rotation.y);
        $(form).find('input[name=rz]').val(placement.rotation.z);
        $(form).find('select[name=aunit]').val(placement.rotation.aunit);
    },

    LUnitChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'volume')
            return;

        var p=$(elem).attr('name');
        console.log('Change placement simple parameter '+p+' to '+ value);
        current.data.placement.position.lunit=value;
        DrawModel(current);
    },

    AUnitChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'volume')
            return;

        var p=$(elem).attr('name');
        console.log('Change placement simple parameter '+p+' to '+ value);
        current.data.placement.rotation.aunit=value;
        DrawModel(current);
    },

    PosValueChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'volume')
            return;
        var p=$(elem).attr('name');
        p=p.substr(1);
        console.log('Change placement parameter '+p+' to '+ value);
        current.data.placement.position[p]=value;
        DrawModel(current);
    },

    RotValueChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'volume')
            return;
        var p=$(elem).attr('name');
        p=p.substr(1);
        console.log('Change placement parameter '+p+' to '+ value);
        current.data.placement.rotation[p]=value;
        DrawModel(current);
    },
}
