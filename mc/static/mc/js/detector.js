$(document).ready(function () {
    DetectorForm.InitDialog();
    InitTableEditor();
});

var DetectorModel = {
    InitQuantityParameter:
    {
        trackLength: function(quantity)
        {
            quantity.parameter.wflag=false;
            quantity.parameter.kflag=false;
            quantity.parameter.vflag=false;
        },

        passageCellCurrent: function(quantity)
        {
            quantity.parameter.wflag=true;
        },

        passageTrackLength: function(quantity)
        {
            quantity.parameter.wflag=true;
        },

        flatSurfaceCurrent: function(quantity)
        {
            quantity.parameter.dflag=0;
            quantity.parameter.wflag=true;
            quantity.parameter.aflag=true;
        },

        flatSurfaceFlux: function(quantity)
        {
            quantity.parameter.dflag=0;
        },

        nOfCollision: function(quantity)
        {
            quantity.parameter.wflag=false;
        },

        population: function(quantity)
        {
            quantity.parameter.wflag=false;
        },

        nOfTrack: function(quantity)
        {
            quantity.parameter.dflag=0;
            quantity.parameter.wflag=false;
        },

        nOfTerminatedTrack: function(quantity)
        {
            quantity.parameter.wflag=false;
        },

        GPEnergyDistribution: function(quantity)
        {
            quantity.parameter.direction=1;
            quantity.parameter.bin_width=0.01;
            quantity.parameter.unit="MeV";
        },
        GPPhaseScorer: function(quantity)
        {
            quantity.parameter.direction=1;
            quantity.parameter.kflag=false;
        },


    },

    InitFilterParameter:
    {
        kineticEnergy: function(filter)
        {
            filter.parameter.elow=0;
            filter.parameter.ehigh=10;
            filter.parameter.unit="MeV";
        },

        particle: function(filter)
        {
            filter.parameter.list=["e-","e+","gamma"];
        },

        particleWithKineticEnergy: function(filter)
        {
            filter.parameter.elow=0;
            filter.parameter.ehigh=10;
            filter.parameter.unit="MeV";
            filter.parameter.list=["e-","e+","gamma"];
        },
    },

    QuantitiesMesh:
    {
        energyDeposit:'energyDeposit',
        cellCharge:'cellCharge',
        cellFlux:'cellFlux',
        passageCellFlux:'passageCellFlux',
        doseDeposit:'doseDeposit',
        nOfStep:'nOfStep',
        nOfSecondary:'nOfSecondary',
        trackLength:'trackLength',
        passageCellCurrent:'passageCellCurrent',
        passageTrackLength:'passageTrackLength',
        flatSurfaceCurrent:'flatSurfaceCurrent',
        flatSurfaceFlux:'flatSurfaceFlux',
        nOfCollision:'nOfCollision',
        population:'population',
        nOfTrack:'nOfTrack',
        nOfTerminatedTrack:'nOfTerminatedTrack',
    },

    FiltersMesh:
    {
        none:'--',
        charged:'charged',
        neutral:'neutral',
        kineticEnergy:'kineticEnergy',
        particle:'particle',
        particleWithKineticEnergy:'particleWithKineticEnergy',
    },

    QuantitiesDist:
    {
        GPEnergyDistribution:'GPEnergyDistribution',
        GPPhaseScorer:'GPPhaseScorer',
    },

    FiltersDist:
    {
        none:'--',
        particle:'particle',
    },

    SDType: {
        mesh:'mesh',
        dist:'dist',
    }, 

    GetQuantities: function(sd)
    {
        if(sd==='dist')
            return this.QuantitiesDist;
        return this.QuantitiesMesh;
    },

    GetFilters: function(sd)
    {
        if(sd==='dist')
            return this.FiltersDist;
        return this.FiltersMesh;
    },

    NewSD: function(type='mesh')
    {
        var sd=
        {
            type:this.SDType.mesh,
            name:'detector',
            quantities: new Array(),
            parameter: null,
        };
        if(type==='dist')
            sd.type=this.SDType.dist;
        else
            sd.parameter={x:10,y:10,z:10};
        return sd;
    },

    NewQuantity: function(sd='mesh',qt='energyDeposit')
    {
        var q = 
            {
                type:qt,
                name:qt+'.name',
                parameter:{},
                filter:{type: '--',
                    name: '--',
                    parameter:{},
                },
            };
        if(sd=='dist')
        {
            q.type=this.QuantitiesDist[qt];
            if(q.type===undefined)
                q.type=this.QuantitiesDist.GPEnergyDistribution;
        }
        else
        {
            q.type=this.QuantitiesMesh[qt];
            if(q.type===undefined)
                q.type=this.QuantitiesMesh.energyDeposit;
        }
        q.name='quantity.'+Math.round(1000+Math.random()*1000);
        return q;
    },

};

var DetectorForm = {
    detector:null,

    MakeSelectForm: function(options)
    {
        var select = '<select>';
        for(opt in options)
        {
            select+='<option>' + options[opt] + '</option>'
        }
        select+='</select>';
        return select;
    },

    InitForm: function(det)
    {
        var that=this;
        this.detector=det;
        var form=$("#sensitive-detector");
        $(form).find('select[name=type]').val(this.detector.type);
        $(form).find('input[name=name]').val(this.detector.name);
        this.InitDetType(form);
        var tbody=$('#sd-quantities-tbody');
        tbody.empty();
        for(var i=0; i< this.detector.quantities.length; i++)
        {
            var quantity=this.detector.quantities[i];
            var filter=quantity.filter;
            //if($.isEmptyObject(filter))
            //    filter={ type:'--', name:'--', parameter:{}, };
            tbody.append('<tr id='+i+'>' +
                '<td id="qt">' + quantity.type + '</td>' +
                '<td id="qn">' + quantity.name + '</td>' +
                '<td id="qp">' + JSON.stringify(quantity.parameter) + '</td>' +
                '<td id="ft">' + filter.type + '</td>' +
                '<td id="fn">' + filter.name + '</td>' +
                '<td id="fp">' + JSON.stringify(filter.parameter) + '</td>' +
                '</tr>');
        }
        var opts=DetectorModel.GetQuantities(this.detector.type);
        tbody.find('td#qt').makeTableEdit('select',this.MakeSelectForm(opts),this.QuantityTypeChanged);
        tbody.find('td#qn').makeTableEdit('input','<input type="text" value="" />',this.QuantityNameChanged);
        tbody.find('td#qp').makeTableEdit('input','<input type="text" value="" />',this.QuantityParameterChanged,this.QuantityParameterVerify);

        opts=DetectorModel.GetFilters(this.detector.type);
        tbody.find('td#ft').makeTableEdit('select',this.MakeSelectForm(opts),this.FilterTypeChanged);
        tbody.find('td#fn').makeTableEdit('input','<input type="text" value="" />',this.FilterNameChanged);
        tbody.find('td#fp').makeTableEdit('input','<input type="text" value="" />',this.FilterParameterChanged,this.FilterParameterVerify);

        $('#sd-quantities-tbody tr').click(function (event) {
            $('#sd-quantities-tbody tr').css("background-color", "white");
            var id=$(this).attr('id'); 
            $(this).css("background-color", "red");
            that.select_quantity_id=id;
        });

    },

    QuantityTypeChanged: function(i,val)
    {
        DetectorForm.detector.quantities[i].type=val;
        DetectorForm.detector.quantities[i].parameter={};
        var fn=DetectorModel.InitQuantityParameter[val.toString()];
        if(fn!=undefined)
            fn(DetectorForm.detector.quantities[i]);
        var tbody=$('#sd-quantities-tbody');
            tbody.find('tr#'+i).find('td#qp').html(JSON.stringify(DetectorForm.detector.quantities[i].parameter));
    },

    QuantityNameChanged: function(i,val)
    {
        DetectorForm.detector.quantities[i].name=val;
    },

    QuantityParameterChanged: function(i,val)
    {
        DetectorForm.detector.quantities[i].parameter=JSON.parse(val);
    },

    FilterTypeChanged: function(i,val)
    {
        DetectorForm.detector.quantities[i].filter.type=val;
        DetectorForm.detector.quantities[i].filter.parameter={};
        var fn=DetectorModel.InitFilterParameter[val.toString()];
        if(fn!=undefined)
            fn(DetectorForm.detector.quantities[i].filter);

        var tbody=$('#sd-quantities-tbody');
            tbody.find('tr#'+i).find('td#fp').html(JSON.stringify(DetectorForm.detector.quantities[i].filter.parameter));
    },

    FilterNameChanged: function(i,val)
    {
        DetectorForm.detector.quantities[i].filter.name=val;
    },

    FilterParameterChanged: function(i,val)
    {
        DetectorForm.detector.quantities[i].filter.parameter=JSON.parse(val);
    },

    QuantityParameterVerify: function(i,val)
    {
        try
        {
            parameter=JSON.parse(val);
        }
        catch(e)
        {
            alert('Invalid input: ', e);
            return false;
        }
        return true;
    },

    FilterParameterVerify: function(i,val)
    {
        try
        {
            parameter=JSON.parse(val);
        }
        catch(e)
        {
            alert('Invalid input: ', e);
            return false;
        }
        return true;
    },

    InitDetType: function(form)
    {
        var p=$(form).find('input[name=bins]').parent();
        if(this.detector.type==='mesh')
        {
            if(this.detector.parameter===undefined)
                this.detector.parameter={x:10,y:10,z:10};
            $(form).find('input[name=bins]').val(this.detector.parameter.x+", " + this.detector.parameter.y+", " + this.detector.parameter.z);
            $(p).removeClass('hidden');
        }
        else
            $(p).addClass('hidden');

    },

    TypeChanged: function(elem)
    {
        var value=$(elem).val();
        var instance = $('#project-view').jstree(true);
        var selects=instance.get_selected(true);
        if(selects.length < 1)
            return;
        var current=selects[0];
        if(current.type != 'volume')
            return;

        console.log('Change detector type to '+ value);
        current.data.detector=DetectorModel.NewSD(value);
        this.InitForm(current.data.detector);
    },

    NameChanged: function(elem)
    {
        var value=$(elem).val();
        this.detector.name=value;
    },

    BinsChanged: function(elem)
    {
        var v=$(elem).val();
        v=v.split(',');
        if(v.length<3)
        {
            alert("Invalid bins setup");
        }
        x=parseFloat(v[0]);
        y=parseFloat(v[1]);
        z=parseFloat(v[2]);
        if(isNaN(x) || isNaN(y) || isNaN(z))
        {
            alert("Invalid bins setup");
        }
        this.detector.parameter.x=x;
        this.detector.parameter.y=y;
        this.detector.parameter.z=z;
    },


    InitDialog: function()
    {
        var that=this;
        $( "#sd-quantities-tbody" ).selectable();

        $( "#sensitive-detector" ).dialog({
            autoOpen: false,
            height: 480,
            width: 800,
            modal: true,
            buttons: {
                'Add Quantity': function() {
                    console.log('add quantity');
                    DetectorForm.detector.quantities.push(DetectorModel.NewQuantity(DetectorForm.detector.type));
                    DetectorForm.InitForm(DetectorForm.detector);
                },
                'Remove Quantity': function() {
                    console.log('remove quantity');
                    if(that.select_quantity_id)
                    {
                        DetectorForm.detector.quantities.splice(that.select_quantity_id,1);
                        DetectorForm.InitForm(DetectorForm.detector);
                    }
                },
                Ok: function() {
                    $( this ).dialog( "close" );
                },
            },
            close: function() {
            }
        });
    },

    Open: function()
    {
        $("#sensitive-detector").dialog("open");
    },

};
//https://stackoverflow.com/questions/1224729/using-jquery-to-edit-individual-table-cells
function InitTableEditor()
{
    $.fn.makeTableEdit = function(tag,html,fn_onchange=null,fn_verify=null) {
        $(this).on('click',function(){
            if($(this).find(tag).is(':focus')) return this;
            var cell = $(this);
            var width = cell.width();
            var height = cell.height();
            var content = $(this).html();
            $(this).html(html)
                .find(tag).val(content).width(width).height(height)
                .trigger('focus')
                .on({
                    'blur': function(){
                        $(this).trigger('saveEditable');
                    },
                    'keyup':function(e){
                        if(e.which == '13'){ // enter
                            $(this).trigger('saveEditable');
                        } else if(e.which == '27'){ // escape
                            $(this).trigger('closeEditable');
                        }
                    },
                    'closeEditable':function(){
                        cell.html(content);
                    },
                    'saveEditable':function(){
                        content = $(this).val();
                        $(this).trigger('closeEditable');
                        var id=cell.parent().attr("id");
                        console.log('quantity changed, ', id, content);
                        var valid=true;
                        if(fn_verify)
                            valid=fn_verify(id,content);
                        if(!valid)
                        {
                            $(this).focus();
                            return;
                        }
                        if(fn_onchange)
                            fn_onchange(id,content);
                    }
                });
        });
        return this;
    }
}
