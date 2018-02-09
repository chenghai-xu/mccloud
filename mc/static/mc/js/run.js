$(document).ready(function () {
    NodeWatch.push(RunForm);
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

RunForm.OnClick=function(current)
{
    if(current.type != 'run')
        return;

    var property = $('#property-run').clone();
    property.attr("id","property-current");
    property.removeClass('hidden');

    RunForm.current=current;
    RunForm.form=property;
    RunForm.Init();

    $('#property-container').append(property);
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
            url: "/mc/job/verify/?id="+current_project, 
            data:JSON.stringify({verify:true}),
            success: function(data){
                console.log(data);
                console.log('Verify project success');
            }
        });
    });
};

RunForm.Run=function()
{
    console.log('Run setup');
    SaveProject(function(){
        $.post({ 
            url: "/mc/job/create/?project="+current_project, 
            data:JSON.stringify({create:true}),
            success: function(data){
                console.log(data);
                if(data.success==false && data.cash ==0)
                {
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
    var id = RunForm.current.data.order.id;
    console.log('Pay order ',id);
    $.post({ 
        url: "/mc/order/pay/?id="+id, 
        data:JSON.stringify({create:true}),
        success: function(data){
            console.log(data);
            if(data.success==false && data.cash ==0)
            {
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
    console.log('Execute job ',id);
    $.post({ 
        url: "/mc/job/execute/?id="+id, 
        data:JSON.stringify({create:true}),
        success: function(data){
            console.log(data);
            if(data.success==false && data.cash ==0)
            {
            }
            else
            {
                OutputForm.Update();
            }
        }
    });
};
