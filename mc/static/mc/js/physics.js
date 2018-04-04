$(document).ready(function () {
    NodeWatch.Add('physics','#property-physics',PPhysics);
});

function NewPhysicsNode(t){
    var node=NewNode('Physics','physics'); 
    node.data=PPhysics.New();
    return node;
}

var PPhysics = {
    ListMap: new Map([
        ['FTFP_BERT'     ,'FTFP_BERT'     ],
        ['FTFP_BERT_TRV' ,'FTFP_BERT_TRV' ],
        ['FTFP_BERT_ATL' ,'FTFP_BERT_ATL' ],
        ['FTFP_BERT_HP'  ,'FTFP_BERT_HP'  ],
        ['FTFP_INCLXX'   ,'FTFP_INCLXX'   ],
        ['FTFP_INCLXX_HP','FTFP_INCLXX_HP'],
        ['FTF_BIC'       ,'FTF_BIC'       ],
        ['LBE'           ,'LBE'           ],
        ['QBBC'          ,'QBBC'          ],
        ['QGSP_BERT'     ,'QGSP_BERT'     ],
        ['QGSP_BERT_HP'  ,'QGSP_BERT_HP'  ],
        ['QGSP_BIC'      ,'QGSP_BIC'      ],
        ['QGSP_BIC_HP'   ,'QGSP_BIC_HP'   ],
        ['QGSP_BIC_AllHP','QGSP_BIC_AllHP'],
        ['QGSP_FTFP_BERT','QGSP_FTFP_BERT'],
        ['QGSP_INCLXX'   ,'QGSP_INCLXX'   ],
        ['QGSP_INCLXX_HP','QGSP_INCLXX_HP'],
        ['QGS_BIC'       ,'QGS_BIC'       ],
        ['Shielding'     ,'Shielding'     ],
        ['ShieldingLEND' ,'ShieldingLEND' ],
        ['ShieldingM'    ,'ShieldingM'    ],
        ['NuBeam'        ,'NuBeam'        ],

    ]), 
    EmMap: new Map([
        ['STD',''],
        ['EMV','_EMV'],
        ['EMX','_EMX'],
        ['EMY','_EMY'],
        ['EMZ','_EMZ'],
        ['LIV','_LIV'],
        ['PEN','_PEN'],
        ['GS' ,'__GS'],
    ]),
    New: function(){
        var node={type:'Factory',list:'FTFP_BERT',em:''};
        return node;
    },

    Init: function()
    {
        var form=this.form;
        var data=this.current.data;
        $(form).find('div .input-group').addClass('hidden');
        $(form).find('#gps-phy-list').removeClass('hidden');
        $(form).find('select[name=list]').val(data.list);
        $(form).find('#gps-phy-em').removeClass('hidden');
        $(form).find('select[name=em]').val(data.em);
    },

    ListChanged: function(elem)
    {
        var value=$(elem).val();
        this.current.data.list=value;
        console.log('Change physics list to: ',value);
    },

    EmChanged: function(elem)
    {
        var value=$(elem).val();
        this.current.data.em=value;
        console.log('Change physics parameter em to '+ value);

    },
}

