$(document).ready(function () {
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
