$(document).ready(function () {
        NodeWatch.Add('volume', '#property-volume',VolumeControl);
});
var VolumeControl={ form: null, current: null,};

VolumeControl.NameChanged=function(form){
    var name=$(form).val();
    var instance = $('#project-view').jstree(true);
    instance.rename_node(this.current,name);
} 
VolumeControl.Init=function()
{
    $('#myTab #home-tab').tab('show');
    var current=this.current;
    var property=this.form;
    $(property).find('select[name=solid]').val(current.data.solid.type);
    $(property).find('input[name=name]').val(current.text);
    if(current.text=='world' ||current.text=='parallel' )
        $(property).find('input[name=name]').attr("disabled","disabled");
    if(current.text!='world' && current.text!='parallel' )
        $(property).find('select[name=placement]').val(current.data.placement.type);

    //$(property).find('input[name=material]').val(current.data.material);
    var select=property.find('select[name=material]');
    select.empty();
    var all=MaterialsControl.GetAllMaterials();
    for (var i in all)
    {
        select.append('<option>' + all[i] +'</option>');
    }
    for(var i in MaterialsModel.Materials)
    {
        if(MaterialsModel.Materials[i].name!=current.data.name)
        {
            select.append('<option>' + MaterialsModel.Materials[i].name +'</option>');
        }
    }
    select.val(current.data.material);

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

    //$('#property-container').append(property);
    this.InitSolidForm();
    var scale=DrawModel(current);

    if(current.text==='world' && 
            RunForm.verify_task &&
            RunForm.verify_task.trj)
    {
        DoDrawTrajectory(scene,RunForm.verify_task.trj,scale);
    }
}

VolumeControl.Add=function(){
    var instance = $('#project-view').jstree(true);
    var node = NewVolumeNode('volume');
    node.data.placement.position.x=Math.random()*5-2.5;
    node.data.placement.position.y=Math.random()*5-2.5;
    node.data.placement.position.z=Math.random()*5-2.5;
    var res = instance.create_node(this.current,node);
    console.log('create volume: ' + res);
    DrawModel(instance.get_node(res));
} 

VolumeControl.Delete=function(){
    var instance = $('#project-view').jstree(true);
    var par = instance.get_node(instance.get_parent(this.current));
    if(par.type == 'geometry')
        return;
    var res = instance.delete_node(this.current);
    this.current=null;
    console.log('delete volume: ' + res);
    DrawModel(par);
} 
VolumeControl.InitSolidForm=function(){
    var instance = $('#project-view').jstree(true);
    var current=this.current;
    var solid=current.data.solid;
    var wigdet=null;
    if(solid.type=='box'){
        wigdet = $('#property-solid-box').clone();
        SolidBox.node=current;
        SolidBox.data=solid;
        SolidBox.form=wigdet;
        SolidBox.Init();
    }
    else if(solid.type=='tube')
    {
        wigdet = $('#property-solid-tube').clone();
        SolidTube.node=current;
        SolidTube.data=solid;
        SolidTube.form=wigdet;
        SolidTube.Init();
    }
    else if(solid.type=='sphere')
    {
        wigdet = $('#property-solid-sphere').clone();
        SolidSphere.node=current;
        SolidSphere.data=solid;
        SolidSphere.form=wigdet;
        SolidSphere.Init();
    }
    else if(solid.type=='cone')
    {
        wigdet = $('#property-solid-cone').clone();
        SolidCone.node=current;
        SolidCone.data=solid;
        SolidCone.form=wigdet;
        SolidCone.Init();
    }
    else if(solid.type=='para')
    {
        wigdet = $('#property-solid-para').clone();
        SolidPara.node=current;
        SolidPara.data=solid;
        SolidPara.form=wigdet;
        SolidPara.Init();
    }
    else 
        return;


    $(wigdet).find('select[name=solid]').val(solid.type);
    wigdet.attr("id","property-detail-current");
    wigdet.removeClass('hidden');
    $('#property-detail-current').remove();
    $('#property-detail-container').append(wigdet);
} 

VolumeControl.SolidTypeChanged=function(sel){
    var selected=$(sel).val();
    var instance = $('#project-view').jstree(true);
    var current=this.current;
    var solid=current.data.solid;
    if(selected==solid.type)
        return;

    var par = instance.get_node(instance.get_parent(current));
    if(par.text=='parallel' )
    {
        if(selected != "box")
        {
            alert("Only Box is support!");
            $(sel).val("box");
            return;
        }
    }
    current.data.solid=NewSolid(selected);
    this.InitSolidForm();
    DrawModel(current);
} 

VolumeControl.ChangePlacementType=function()
{};
VolumeControl.InitPlacementForm=function()
{
    var instance = $('#project-view').jstree(true);
    var current=this.current;
    var placement=current.data.placement;
    var wigdet=null;
    if(placement==undefined || placement.type!='simple'){
        return;
    }

    wigdet = $('#property-placement-simple').clone();
    PlacementSimple.data=placement;
    PlacementSimple.node=current;
    PlacementSimple.form=wigdet;
    PlacementSimple.Init();

    $(wigdet).find('select[name=placement]').val(placement.type);
    wigdet.attr("id","property-detail-current");
    wigdet.removeClass('hidden');
    $('#property-detail-current').remove();
    $('#property-detail-container').append(wigdet);
}

VolumeControl.EditDetector=function()
{
    var instance = $('#project-view').jstree(true);
    var current=this.current;
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
        if(current.data.solid.type != "box")
        {
            alert("Only Box is support!");
            return;
        }
        opts.append('<option>mesh</option>');
    }
    else
    {
        opts.append('<option>dist</option>');
    }

    DetectorForm.InitForm(current.data.detector);
    DetectorForm.Open();
};

VolumeControl.OnMaterialChanged = function(el){
    var instance = $('#project-view').jstree(true);
    var current=this.current;
    current.data.material=$(el).val();
};

var PlacementSimple = {
    data: null,
    node: null,
    form: null,
    Init: function()
    {
        var placement=this.data;
        var form=this.form;
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
        var p=$(elem).attr('name');
        console.log('Change placement simple parameter '+p+' to '+ value);
        this.data.position.lunit=value;
        DrawModel(this.node);
    },

    AUnitChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change placement simple parameter '+p+' to '+ value);
        this.data.rotation.aunit=value;
        DrawModel(this.node);
    },

    PosValueChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        p=p.substr(1);
        console.log('Change placement parameter '+p+' to '+ value);
        this.data.position[p]=value;
        DrawModel(this.node);
    },

    RotValueChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        p=p.substr(1);
        console.log('Change placement parameter '+p+' to '+ value);
        this.data.rotation[p]=value;
        DrawModel(this.node);
    },
}
