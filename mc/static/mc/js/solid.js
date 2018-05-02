$(document).ready(function () {
    VolumeControl.solid_map.set('box',{selector:'#property-solid-box',control:SolidBox}); 
    VolumeControl.solid_map.set('tube',{selector:'#property-solid-tube',control:SolidTube}); 
    VolumeControl.solid_map.set('sphere',{selector:'#property-solid-sphere',control:SolidSphere}); 
    VolumeControl.solid_map.set('cone',{selector:'#property-solid-cone',control:SolidCone}); 
    VolumeControl.solid_map.set('para',{selector:'#property-solid-para',control:SolidPara}); 
    VolumeControl.solid_map.set('trap',{selector:'#property-solid-trap',control:SolidTrap}); 
    VolumeControl.solid_map.set('ellipsoid',{selector:'#property-solid-ellipsoid',control:SolidEllipsoid}); 
});

var SolidBox = {
    node: null,
    data: null,
    form: null,
    Init: function()
    {
        var box=this.data;
        var form=this.form;
        $(form).find('input[name=x]').val(box.parameter.x);
        $(form).find('input[name=y]').val(box.parameter.y);
        $(form).find('input[name=z]').val(box.parameter.z);
        $(form).find('select[name=lunit]').val(box.parameter.lunit);
    },

    LUnitChanged: function(elem)
    {
        var value=$(elem).val();
        console.log('Change box parameter lunit to '+ value);
        this.data.parameter.lunit=value;
        DrawModel(this.node);
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change box parameter '+p+' to '+ value);
        this.data.parameter[p]=parseFloat(value);
        DrawModel(this.node);
    },
}

var SolidTube = {
    node: null,
    data: null,
    form: null,
    Init: function()
    {
        var tube=this.data;
        var form=this.form;
        $(form).find('input[name=rmin]').val(tube.parameter.rmin);
        $(form).find('input[name=rmax]').val(tube.parameter.rmax);
        $(form).find('input[name=z]').val(tube.parameter.z);
        $(form).find('input[name=startphi]').val(tube.parameter.startphi);
        $(form).find('input[name=deltaphi]').val(tube.parameter.deltaphi);
        $(form).find('select[name=lunit]').val(tube.parameter.lunit);
        $(form).find('select[name=aunit]').val(tube.parameter.aunit);
    },

    UnitChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change tube parameter '+p+' to '+ value);
        this.data.parameter[p]=value;
        DrawModel(this.node);
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change tube parameter '+p+' to '+ value);
        this.data.parameter[p]=parseFloat(value);
        DrawModel(this.node);
    },
}

var SolidSphere = {
    node: null,
    data: null,
    form: null,
    Init: function()
    {
        var sphere=this.data;
        var form=this.form;
        $(form).find('input[name=rmin]').val(sphere.parameter.rmin);
        $(form).find('input[name=rmax]').val(sphere.parameter.rmax);
        $(form).find('input[name=starttheta]').val(sphere.parameter.starttheta);
        $(form).find('input[name=deltatheta]').val(sphere.parameter.deltatheta);
        $(form).find('input[name=startphi]').val(sphere.parameter.startphi);
        $(form).find('input[name=deltaphi]').val(sphere.parameter.deltaphi);
        $(form).find('select[name=lunit]').val(sphere.parameter.lunit);
        $(form).find('select[name=aunit]').val(sphere.parameter.aunit);
    },

    UnitChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change sphere parameter '+p+' to '+ value);
        this.data.parameter[p]=value;
        DrawModel(this.node);
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change sphere parameter '+p+' to '+ value);
        this.data.parameter[p]=parseFloat(value);
        DrawModel(this.node);
    },
}

var SolidCone = {
    node: null,
    data: null,
    form: null,
    Init: function()
    {
        var cone=this.data;
        var form=this.form;
        $(form).find('input[name=z]').val(cone.parameter.z);
        $(form).find('input[name=rmin1]').val(cone.parameter.rmin1);
        $(form).find('input[name=rmax1]').val(cone.parameter.rmax1);
        $(form).find('input[name=rmin2]').val(cone.parameter.rmin2);
        $(form).find('input[name=rmax2]').val(cone.parameter.rmax2);
        $(form).find('input[name=startphi]').val(cone.parameter.startphi);
        $(form).find('input[name=deltaphi]').val(cone.parameter.deltaphi);
        $(form).find('select[name=lunit]').val(cone.parameter.lunit);
        $(form).find('select[name=aunit]').val(cone.parameter.aunit);
    },

    UnitChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change cone parameter '+p+' to '+ value);
        this.data.parameter[p]=value;
        DrawModel(this.node);
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change cone parameter '+p+' to '+ value);
        this.data.parameter[p]=parseFloat(value);
        DrawModel(this.node);
    },
}

var SolidPara = {
    node: null,
    data: null,
    form: null,
    Init: function()
    {
        var para=this.data;
        var form=this.form;
        $(form).find('input[name=x]').val(para.parameter.x);
        $(form).find('input[name=y]').val(para.parameter.y);
        $(form).find('input[name=z]').val(para.parameter.z);
        $(form).find('input[name=alpha]').val(para.parameter.alpha);
        $(form).find('input[name=theta]').val(para.parameter.theta);
        $(form).find('input[name=phi]').val(para.parameter.phi);
        $(form).find('select[name=lunit]').val(para.parameter.lunit);
        $(form).find('select[name=aunit]').val(para.parameter.aunit);
    },

    UnitChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change para parameter '+p+' to '+ value);
        this.data.parameter[p]=value;
        DrawModel(this.node);
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change para parameter '+p+' to '+ value);
        this.data.parameter[p]=parseFloat(value);
        DrawModel(this.node);
    },
}

var SolidTrap = {
    node: null,
    data: null,
    form: null,
    Init: function()
    {
        var para=this.data;
        var form=this.form;
        $(form).find('input[name=z]').val(para.parameter.z);
        $(form).find('input[name=x1]').val(para.parameter.x1);
        $(form).find('input[name=y1]').val(para.parameter.y1);
        $(form).find('input[name=x2]').val(para.parameter.x2);
        $(form).find('input[name=y2]').val(para.parameter.y2);
        $(form).find('input[name=x3]').val(para.parameter.x3);
        $(form).find('input[name=x4]').val(para.parameter.x4);
        $(form).find('input[name=alpha1]').val(para.parameter.alpha1);
        $(form).find('input[name=alpha2]').val(para.parameter.alpha2);
        $(form).find('input[name=theta]').val(para.parameter.theta);
        $(form).find('input[name=phi]').val(para.parameter.phi);
        $(form).find('select[name=lunit]').val(para.parameter.lunit);
        $(form).find('select[name=aunit]').val(para.parameter.aunit);
    },

    UnitChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change para parameter '+p+' to '+ value);
        this.data.parameter[p]=value;
        DrawModel(this.node);
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change para parameter '+p+' to '+ value);
        this.data.parameter[p]=parseFloat(value);
        DrawModel(this.node);
    },
}

var SolidEllipsoid = {
    node: null,
    data: null,
    form: null,
    Init: function()
    {
        var para=this.data;
        var form=this.form;
        $(form).find('input[name=ax]').val(para.parameter.ax);
        $(form).find('input[name=by]').val(para.parameter.by);
        $(form).find('input[name=cz]').val(para.parameter.cz);
        $(form).find('input[name=zcut1]').val(para.parameter.zcut1);
        $(form).find('input[name=zcut2]').val(para.parameter.zcut2);
        $(form).find('select[name=lunit]').val(para.parameter.lunit);
    },

    UnitChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change para parameter '+p+' to '+ value);
        this.data.parameter[p]=value;
        DrawModel(this.node);
    },

    ValueChanged: function(elem)
    {
        var value=$(elem).val();
        var p=$(elem).attr('name');
        console.log('Change para parameter '+p+' to '+ value);
        this.data.parameter[p]=parseFloat(value);
        DrawModel(this.node);
    },
}
