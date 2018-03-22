$(document).ready(function () {
    NodeWatch.Add('run','#property-run',RunForm);
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
            alert(data.tips);
            if(data.success==false)
            {
            }
            else
            {
                OutputForm.Update();
            }
        }
    });
};

