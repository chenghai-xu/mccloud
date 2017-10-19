$(document).ready(function () {
});

var SolidBox = {
    InitForm: function(form, box)
    {
        $(form).find('input[name=x]').val(box.parameter.x);
        $(form).find('input[name=y]').val(box.parameter.y);
        $(form).find('input[name=z]').val(box.parameter.z);
        $(form).find('select[name=lunit]').val(box.parameter.lunit);
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

        console.log('Change box parameter lunit to '+ value);
        current.data.solid.parameter.lunit=value;
        DrawModel(current);
    },

    ValueChanged: function(elem)
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
        console.log('Change box parameter '+p+' to '+ value);
        current.data.solid.parameter[p]=parseFloat(value);
        DrawModel(current);
    },
}

var SolidTube = {
    InitForm: function(form, tube)
    {
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
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'volume')
            return;

        var p=$(elem).attr('name');
        console.log('Change tube parameter '+p+' to '+ value);
        current.data.solid.parameter[p]=value;
        DrawModel(current);
    },

    ValueChanged: function(elem)
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
        console.log('Change tube parameter '+p+' to '+ value);
        current.data.solid.parameter[p]=parseFloat(value);
        DrawModel(current);
    },
}

var SolidSphere = {
    InitForm: function(form, sphere)
    {
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
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'volume')
            return;

        var p=$(elem).attr('name');
        console.log('Change sphere parameter '+p+' to '+ value);
        current.data.solid.parameter[p]=value;
        DrawModel(current);
    },

    ValueChanged: function(elem)
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
        console.log('Change sphere parameter '+p+' to '+ value);
        current.data.solid.parameter[p]=parseFloat(value);
        DrawModel(current);
    },
}
