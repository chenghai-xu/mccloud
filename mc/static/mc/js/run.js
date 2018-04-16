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

RunForm.CheckVerify=function()
{
    if(!RunForm.verify_task || !RunForm.verify_task.id)
        return;
    $.get({ 
        url: "/mc/job/verify/?id="+id_current_project+'&task='+RunForm.verify_task.id, 
        success: function(data){
            if(data.status!='SUCCESS')
            {
                setTimeout(RunForm.CheckVerify,2000); 
                return;
            }
            RunForm.verify_task=data;
            $('#Console #output').text(data.log);
            $('#myTab #contact-tab').tab('show');
            if(data.result != 0)
            {
                alert('It looks that they are some problems. Please check the console log!')
            }
            else
            {
                alert('It looks that they are no problems. Please check the trajectory and console log!')
            }
            DrawTrajectory(data.trj);
        }
    });
}

RunForm.Verify=function()
{
    console.log('Verify project ',id_current_project);
    SaveProject(function(){
        $.post({ 
            url: "/mc/job/verify/?id="+id_current_project, 
            success: function(data){
                RunForm.verify_task=data;
                console.log('success submit verify task ',data.id);
                setTimeout(RunForm.CheckVerify,2000); 
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
                RunForm.current.data.job.task=data.task;
                $('#job-progress #job-progress-bar').attr('style','width: 0%;');
                $('#job-progress #job-progress-msg').text('Your job is pending!');
                $("#job-progress").dialog('open');
                RunForm.progress=0;
                setTimeout(RunForm.LoopCheck,30000); 

            }
        }
    });
};

RunForm.LoopCheck=function()
{
    if(!RunForm.current.data.job.task || !RunForm.current.data.job.task.id)
        return;
    $.get({ 
        url: "/mc/job/execute/?id="+RunForm.current.data.job.id+'&task='+RunForm.current.data.job.task.id, 
        success: function(data){
            RunForm.current.data.job=data;
            var interval = 30000;
            if(data.task.status==='SUCCESS')
            {
                OutputForm.New(RunForm.current.data.job);
                $('#job-progress #job-progress-bar').attr('style','width: 100%;');
                $('#job-progress #job-progress-msg').text('Your job is done, please check the output!');
                return;
            }
            else if(data.task.status==='STARTED')
            {
                //5 minute tolerance
                var per=100*RunForm.progress/3600/(RunForm.current.data.job.times+0.08);
                per=Math.round(per);
                var left=(RunForm.current.data.job.times*60-RunForm.progress/60+5).toFixed(2);
                left=left<0?0:left;
                $('#job-progress #job-progress-bar').attr('style','width: '+per+'%;');
                $('#job-progress #job-progress-msg').text('Your job is running, please wait about '+left+' minutes!');
                console.log('check job status.');
                RunForm.progress+=interval/1000;
            }
            else 
            {
                $('#job-progress #job-progress-bar').attr('style','width: 0%;');
                $('#job-progress #job-progress-msg').text('Your job is pending, please wait!');
                RunForm.progress=0;
            }
            setTimeout(RunForm.LoopCheck,interval); 

        }
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
        height: 480,
        width: 640,
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

function DrawTrajectory(trjs)
{
    var instance = $('#project-view').jstree(true);
    var root=instance.get_node("#");
    var project=instance.get_node(root.children[0]);
    var geometry=null;
    for(var id of project.children)
    {
        
        geometry=instance.get_node(id);
        if(geometry.type==="geometry")
            break;
    }
    if(!geometry)
        return;

    var mass=null;
    for(var id of geometry.children)
    {
        mass=instance.get_node(id);
        if(mass.text==='world')
            break;
    }
    if(!mass)
        return;
    var scale=DrawModel(mass);
    DoDrawTrajectory(scene,trjs,scale);
}

function DoDrawTrajectory(scn,trjs,scale)
{
    var coef=UnitOf('mm')/UnitOf(scale.lunit);
    //refs:
    //https://stackoverflow.com/questions/31399856/drawing-a-line-with-three-js-dynamically
    for(var k=0; k<trjs.length;k++)
    {
        var trj = trjs[k];
        var MAX_POINTS = trj.points.length;

        // geometry
        var geometry = new THREE.BufferGeometry();

        // attributes
        var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

        // draw range
        drawCount = MAX_POINTS; // draw the first 2 points, only
        geometry.setDrawRange( 0, drawCount );

        // material
        var color = 0x00ff00;
        if(trj.charge>0)
            color=0x0000ff;
        else if(trj.charge<0)
            color=0xff0000;
        else
            color=0x00ff00;
        var material = new THREE.LineBasicMaterial( { color: color } );

        // line
        line = new THREE.Line( geometry,  material );
        scn.add( line );

        var pos = line.geometry.attributes.position.array;

        var x = y = z = index = 0;

        for ( var i = 0; i< MAX_POINTS; i ++ ) 
        {

            pos[ index ++ ] = trj.points[i].x*coef;
            pos[ index ++ ] = trj.points[i].y*coef;
            pos[ index ++ ] = trj.points[i].z*coef;

        }
    }
}

