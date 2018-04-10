$(document).ready(function () {
    csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    ChargeListInit();
    ChargePayInit();
});
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

var ChargeForm={
    charge:{}
};
ChargeForm.ValueChanged=function(el)
{
    var val =$(el).val();
    this.charge.value=val;
    console.log("Change charge value to",val);
}
ChargeForm.Next=function(el)
{
    var value = parseFloat(this.charge.value);
    if(value <1 || isNaN(value))
        return;
    console.log('post charge:',this.charge);
    $.post({ 
        url: "/home/charge/", 
        data:this.charge,
        success: function(data){
            console.log(data);
            if(data.success)
            {
                ChargeForm.charge=data.charge;
                ChargePayOpen(data);
            }
        }
    });
}
ChargeForm.ChargeList=function(el)
{
    console.log('get charge history.');
    $.get({ 
        url: "/home/charge_list/", 
        success: function(data){
            console.log(data);
            ChargeListOpen(data);
        }
    });
}

function ChargePayInit()
{
    $("#charge-pay").dialog({
        autoOpen: false,
        height: 640,
        width: 640,
        modal: true,
        buttons: {
            "Weixin": function() {
                ChargeForm.charge.method=1;
                ChargeForm.Next();
            },
            "Alipay": function() {
                ChargeForm.charge.method=0;
                ChargeForm.Next();
            },
            "Charge Done": function() {
                $( this ).dialog( "close" );
                window.location = '/home';
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
}

function ChargeListInit()
{
    $("#charge-list").dialog({
        autoOpen: false,
        height: 480,
        width: 480,
        modal: true,
        buttons: {
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
        }
    });
}

function ChargePayOpen(data)
{
    if(data)
    {
        if(data.url)
        $("#charge-pay img" ).attr("src",data.url);
        if(data.charge.value)
        $("#charge-pay #tips").text("Please transfer " + data.charge.value +" RMB to the following account:");
    }
    $("#charge-pay" ).dialog("open");
}
function ChargeListOpen(data)
{
    console.log(data);
    var tbody=$('#charge-tbody');
    tbody.empty();
    for(var i=0; i< data.length; i++)
    {
        tbody.append('<tr id='+data[i].id+'>' +
            '<td>' + data[i].create_time.substring(0,10)+'</td>' +
            '<td>' + data[i].value + '</td>' +
            '<td>' + data[i].method + '</td>' +
            '<td>' + data[i].executed + '</td>' +
            '</tr>');
    }
    $( "#charge-list" ).dialog("open");
}
