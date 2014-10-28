_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g};
var sendCmdUrl = "./modules/pyCtrl/getScriptData.php";


var Script = {
    _template: _.template(
        '<div id="script-{{name}}" class="context-menu-pyCtrl-scripts" data-interval="{{trigger_setting.interval}}">' +
        '   <div id="script-{{name}}-dialog" class="dialog" title="{{name}}"></div>' +
        '   <span class="script-status"></span>' +
        '   <span class="script-name">{{name}}</span>' +
        '   <span class="script-uptime">{{uptime}}</span>' +
        '</div>'
    ),
    refreshInterval: null,
    dialogIntervals: {},
    init: function(){
        Script.createList();

    },
    sendCommand: function(cmd_, cb){
        return $.getJSON(sendCmdUrl + "?cmd=/api" + cmd_, function (response) {
            cb(response);
        });
    },
    createList: function(){
        //first make sure the container is empty
        $('#scriptsContainer').html('');
        //Generate the new list
        Script.sendCommand('/script/list',function(scripts){
            _.each(scripts.all, function(script){
                $('#scriptsContainer').append(Script._template(script));
                $("#script-"+script.name+"-dialog").dialog({
                    autoOpen: false,
                    close: function( event, ui ){
                        window.clearInterval(Script.dialogIntervals[script.name]);
                        Script.dialogIntervals[script.name] = undefined;
                    }
                });
            });
        }).done( function(){
            if(Script.refreshInterval == null){
                Script.refreshInterval = setInterval(Script.refreshList, 1000);
            }
        });
    },
    updateList: function(){
        Script.cmd('/script/list/update','All');
        Script.createList();
    },
    refreshList: function(){
        Script.sendCommand('/script/list',function(scripts){
            _.each(scripts.all, function(script) {
                var color = 'gray';
                if(script.running){
                    color = 'red';
                }else if(!script.running && script.enabled){
                    color = 'green';
                }
                var $scriptBox = $("#script-"+script.name);
                $scriptBox.find('.script-status').css({
                    backgroundColor: color
                });
                $scriptBox.find('.script-uptime').html(script.uptime);
            });
        })
    },
    cmd: function(cmd_, name){
        if(cmd_ == '/script/'+name+'/output/live'){
            var $dialogBox = $("#script-"+name+"-dialog");
            if(typeof Script.dialogIntervals[name] === 'undefined'){
                $dialogBox.dialog("open");
                Script.dialogIntervals[name] = setInterval(function(){
                    Script.sendCommand(cmd_,function(response){
                        $dialogBox.html('');
                        _.each(response.output, function(line){
                            $dialogBox.append(line+"<br>");
                        })
                    });
                }, 500);
            }else{
                $dialogBox.dialog("close");
                window.clearInterval(Script.dialogIntervals[name]);
                Script.dialogIntervals[name] = undefined;
            }
        }else{
            Script.sendCommand(cmd_, function (response) {
                $("#scriptResponse").html(name+': '+response.output);
                setTimeout(function(){
                    $("#scriptResponse").html('');
                }, 4000);
            });
        }
    }
}; //END var Script


Script.init();

$("#updateList").on('click', function(){
    Script.updateList();
});
$("#scriptRestart").on('click', function(){
    Script.cmd('/controller/restart', 'ScriptController');
});

$.contextMenu({
    selector: '.context-menu-pyCtrl-scripts',
    trigger: 'right',
    build: function($trigger, e){
        var scriptName = $trigger.find(".script-name").html();
        return {
            callback: function (key, options) {
                var cmd = '/script/'+scriptName+'/'+key;
                Script.cmd(cmd, scriptName);
            }
        };
    },
    events: {
        show: function (e) {
            var currInterval = e.$trigger.data('interval');
            $.contextMenu.setInputValues(e, {interval: currInterval});
        }
    },
    items: {
        "enable": {name: "Enable"},
        "disable": {name: "Disable"},
        "run": {name: "Run"},
        "stop": {name: "Stop"},
        "sep1": "---------",
        "output/live": {name: "Live Output"},
        "sep2": "---------",
        "interval": {
            name: "Interval",
            type: 'text',
            value: 5,
            events: {
                keyup: function(e) {
                    var scriptName = e.data.$trigger.find(".script-name").html();
                    var $target = $(e.currentTarget);
                    var key = event.which || event.keyCode;
                    if(key == 13) {
                        var value = parseInt($target.val(), 10);
                        if(!isNaN(value)){
                            var cmd = '/script/'+scriptName+'/setting/interval/'+value;
                            Script.cmd(cmd, scriptName);
                            e.data.$trigger.data('interval', value);
                        }
                        e.data.$trigger.contextMenu("hide");
                    }
                }
            }
        }
    }
}); //END $.contextMenu
