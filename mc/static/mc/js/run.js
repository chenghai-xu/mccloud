$(document).ready(function () {
    NodeWatch.Add('run','#property-run',RunForm);
    RunForm.InitProgressBar();
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
        unit: 'second',
    };
    return node;
};

RunForm.Init=function()
{
    RunForm.form.find('select[name=type]').val(RunForm.current.data.instance);
    RunForm.form.find('input[name=nodes]').val(RunForm.current.data.nodes);
    RunForm.form.find('input[name=time]').val(RunForm.current.data.time);
    RunForm.form.find('select[name=unit]').val(RunForm.current.data.unit);
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
};

RunForm.UnitChanged=function(el)
{
    RunForm.current.data.unit=$(el).val();
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
                    var x = confirm("Cash is not enough, do you want to charge?");
                    if(x)
                    {
                        window.open('/home/charge');
                    }

                }
                else
                {
                    RunForm.current.data.job=data.job;
                    RunForm.current.data.order=data.order;
                    RunForm.current.data.cash=data.cash;
                    RunForm.PayOrder();
                }
            }
        });
    });
};

RunForm.PayOrder=function()
{
    if(!RunForm.current.data.order)
        return;
    var x = confirm("You will consume "+this.current.data.order.charge+" RMB, do you want to charge?");
    if(!x)
        return;

    var id = RunForm.current.data.order.id;
    console.log('Pay order ',id);
    $.post({ 
        url: "/mc/order/pay/?id="+id, 
        data:{create:true},
        success: function(data){
            console.log(data);
            if(data.success==false)
            {
                alert(data.tips);
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
                RunForm.current.data.job.status='DOING';
                RunForm.InitProgressBar()
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
    if(RunForm.current.data.job.status==='DOING')
    {
        //5 minute tolerance
        var per=100*RunForm.progress/3600/(RunForm.current.data.job.times+0.08);
        per=Math.round(per);
        $('#job-progress #job-progress-bar').attr('style','width: '+per+'%;');
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
        width: 320,
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
