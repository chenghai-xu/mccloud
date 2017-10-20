$(document).ready(function () {
    DetectorForm.InitDialog();
});

var DetectorModel = {
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
                filter:{},
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
        q.name=q.type+'-'+Math.round(1000+Math.random()*1000);
        return q;
    },

};

var DetectorForm = {
    detector:null,

    InitForm: function(det)
    {
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
            if($.isEmptyObject(filter))
                filter={ type:'--', name:'--', parameter:{}, };
            tbody.append('<tr id='+i+'>' +
                '<td>' + quantity.type + '</td>' +
                '<td>' + quantity.name + '</td>' +
                '<td>' + JSON.stringify(quantity.parameter) + '</td>' +
                '<td>' + filter.type + '</td>' +
                '<td>' + filter.name + '</td>' +
                '<td>' + JSON.stringify(filter.parameter) + '</td>' +
                '</tr>');
        }

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

    AddQuantity: function(elem)
    {

    },

    RemoveQuantity: function(elem)
    {

    },

    InitDialog: function()
    {
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
                'Edit Quantity': function() {
                    console.log('edit quantity');
                },
                'Remove Quantity': function() {
                    console.log('remove quantity');
                },
                'Add Filter': function() {
                    console.log('add filter');
                },
                'Edit Filter': function() {
                    console.log('edit filter');
                },
                'Remove Filter': function() {
                    console.log('remove filter');
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

