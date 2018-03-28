$(document).ready(function () {
    NodeWatch.Add('run','#property-run',RunForm);
    RunForm.InitProgressBar();
    RunForm.InitOrderBook();
    RunForm.InitChargeSuggest();
    /*
    RunForm.OpenOrderBook({
        job:
        {instance:'c4.8xlarge',
            nodes:5,
            times:0.1},
        order:
        {charge:1001}
    });
    */
});

var RunModel = {};
var RunForm = {};

RunModel.New=function()
{
    var node=NewNode('Run','run');
    node.data={
        instance: '8Core',
        nodes: '2',
        time: '60',
        unit: 'minute',
    };
    return node;
};

RunForm.Init=function()
{
    RunForm.form.find('select[name=type]').val(RunForm.current.data.instance);
    RunForm.form.find('input[name=nodes]').val(RunForm.current.data.nodes);
    RunForm.form.find('input[name=time]').val(RunForm.current.data.time);
    RunForm.form.find('select[name=unit]').val(RunForm.current.data.unit);
    var min=10;
    var step=1;
    if(this.current.data.unit==='minute')
    {
        min=10;
        step=1;
    }
    else
    {
        min=0.20;
        step=0.1;
    }
    this.form.find('input[name=time]').attr('min',min);
    this.form.find('input[name=time]').attr('step',step);
};

RunForm.TypeChanged=function(el)
{
    RunForm.current.data.instance=$(el).val();
};

RunForm.NodesChanged=function(el)
{
    RunForm.current.data.nodes=$(el).val();
};

RunForm.TimeChanged=function(el)
{
    RunForm.current.data.time=$(el).val();
};

RunForm.UnitChanged=function(el)
{
    RunForm.current.data.unit=$(el).val();
    var min=10;
    var step=1;
    if(this.current.data.unit==='minute')
    {
        min=10;
        step=1;
    }
    else
    {
        min=0.20;
        step=0.1;
    }
    this.form.find('input[name=time]').attr('min',min);
    this.form.find('input[name=time]').attr('step',step);
};

RunForm.Verify=function()
{
    console.log('Verify setup');
    SaveProject(function(){
        $.post({ 
            url: "/mc/job/verify/?id="+id_current_project, 
            data:{verify:true},
            success: function(data){
                $('#Console #output').text(data.out);
                $('#myTab #contact-tab').tab('show');
                if(data.ret != 0)
                {
                    alert('It looks that they are some problems. Please check the console log!')
                }
                else
                {
                    alert('It looks that they are no problems. Please check the console log!')
                }
            }
        });
    });
};

RunForm.Run=function()
{
    console.log('Run setup');
    SaveProject(function(){
        $.post({ 
            url: "/mc/job/create/?project="+id_current_project, 
            data:{create:true},
            success: function(data){
                console.log(data);
                if(data.success==false)
                {
                    alert(data.tips);
                }
                else
                {
                    RunForm.current.data.job=data.job;
                    RunForm.current.data.order=data.order;
                    RunForm.OpenOrderBook(data);
                }
            }
        });
    });
};

RunForm.PayOrder=function()
{
    if(!RunForm.current.data.order)
        return;
    var id = RunForm.current.data.order.id;
    console.log('Pay order ',id);
    $.post({ 
        url: "/home/order/pay/?id="+id, 
        data:{create:true},
        success: function(data){
            console.log(data);
            if(data.success==false)
            {
                $('#charge-suggest').dialog('open');
            }
            else
            {
                RunForm.ExecuteJob();
            }
        }
    });
};

RunForm.ExecuteJob=function(id)
{
    if(!RunForm.current.data.job)
        return;

    var id=RunForm.current.data.job.id;
    OutputForm.New(RunForm.current.data.job);
    SaveProject(cb=null);
    console.log('Execute job ',id);
    $.post({ 
        url: "/mc/job/execute/?id="+id, 
        data:{create:true},
        success: function(data){
            console.log(data);
            if(data.success==false)
            {
                alert('Run job fail, please contact the admin!');
            }
            else
            {
                RunForm.current.data.job.status='UNDO';
                $('#job-progress #job-progress-bar').attr('style','width: 0%;');
                $('#job-progress #job-progress-msg').text('Your job is running!');
                $("#job-progress").dialog('open');
                RunForm.progress=0;
                RunForm.LoopCheck();

            }
        }
    });
};

RunForm.LoopCheck=function()
{
    var interval=30000;
    if(RunForm.current.data.job.status!='DONE')
    {
        //5 minute tolerance
        var per=100*RunForm.progress/3600/(RunForm.current.data.job.times+0.08);
        per=Math.round(per);
        var left=(RunForm.current.data.job.times*60-RunForm.progress/60+5).toFixed(2);
        left=left<0?0:left;
        $('#job-progress #job-progress-bar').attr('style','width: '+per+'%;');
        $('#job-progress #job-progress-msg').text('Your job is running, please wait about '+left+' minutes!');
        console.log('check job status.');
        RunForm.CheckJob();
        setTimeout(RunForm.LoopCheck,interval); 
        RunForm.progress+=interval/1000;
    }
    else
    {
        OutputForm.New(RunForm.current.data.job);
        $('#job-progress #job-progress-msg').text('Your job is done, please check the output!');
    }
};

RunForm.CheckJob=function()
{
    $.get({ 
        url: "/mc/job/create/?id="+RunForm.current.data.job.id, 
        success: function(data)
        {
            RunForm.current.data.job=data;
        },
    });
};

RunForm.InitProgressBar=function()
{
    $("#job-progress").dialog({
        autoOpen: false,
        height: 320,
        width: 480,
        modal: true,
        buttons: {
            Close: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
};

RunForm.InitOrderBook=function()
{
    $("#order-book").dialog({
        autoOpen: false,
        height: 320,
        width: 480,
        modal: true,
        buttons: {
            'Pay & Run' : function() {
                $( this ).dialog( "close" );
                RunForm.PayOrder();
            },
            Back : function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
};
RunForm.OpenOrderBook=function(data)
{
    $("#order-table #order-cost").text(data.order.charge);
    $("#order-book").dialog('open');

    var order=data.order;
    console.log('List of order: ',order);
    var tbody=$('#order-tbody');
    tbody.empty();
    for(var i=0; i< order.item.length; i++)
    {
        tbody.append('<tr id='+order.item[i]+'>' +
            '<td>' + order.names[i] + '</td>' +
            '<td>' + order.count[i] + '</td>' +
            '<td>' + order.price[i] + '</td>' +
            '<td>' + Math.round(order.time[i]*60) + '</td>' +
            '</tr>');
    }
    $("#order-book #order-cost").text(order.charge);
    $("#order-book").dialog('open');
};
RunForm.InitChargeSuggest=function()
{
    $("#charge-suggest").dialog({
        autoOpen: false,
        height: 320,
        width: 480,
        modal: true,
        buttons: {
            Close : function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
};
