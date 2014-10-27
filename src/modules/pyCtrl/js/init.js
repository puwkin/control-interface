_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g};
var sendCmdUrl = "./modules/pyCtrl/getScriptData.php";


var Script = {
    _template: _.template(
        '<div id="script-{{name}}">' +
        '   <div id="script-{{name}}-dialog" class="dialog" title="Output"></div>' +
        '   <span class="script-status"></span>' +
        '   <span class="script-name">{{name}}</span>' +
        '   <span class="script-uptime">{{uptime}}</span>' +
        '   <button data-cmd="/script/{{name}}/enable">Enable</button>' +
        '   <button data-cmd="/script/{{name}}/disable">Disable</button>' +
        '   <button data-cmd="/script/{{name}}/run">Run</button>' +
        '   <button data-cmd="/script/{{name}}/stop">Stop</button>' +
        '   <button class="js-script-output-live" data-cmd="/script/{{name}}/output/live">Output/Live</button>' +
        '</div>'
    ),
    dialogIntervals: {},
    init: function(){
        Script.sendCommand('/script/list',function(scripts){
            _.each(scripts.all, function(script){
                $('#scriptsContainer').append(Script._template(script));
                var $scriptBox = $("#script-"+script.name);
                $scriptBox.find('button').on('click',function(e){
                    Script.cmd(e, script.name);
                });
                $("#script-"+script.name+"-dialog").dialog({
                    autoOpen: false,
                    close: function( event, ui ){
                        window.clearInterval(Script.dialogIntervals[script.name]);
                        Script.dialogIntervals[script.name] = undefined;
                    }
                });
            });
        }).done(function() {
            var refreshInt = setInterval(Script.refreshList, 1000);
        });
    },
    sendCommand: function(cmd_, cb){
        return $.getJSON(sendCmdUrl + "?cmd=" + cmd_, function (response) {
            cb(response);
        });
    },
    refreshList: function(){
        Script.sendCommand('/script/list',function(scripts){
            _.each(scripts.all, function(script) {
                var color = 'gray';
                if (script.enabled) {
                    if (script.running) {
                        color = 'red';
                    } else if (!script.running) {
                        color = 'green';
                    }
                }
                var $scriptBox = $("#script-"+script.name);
                $scriptBox.find('.script-status').css({
                    backgroundColor: color
                });
                $scriptBox.find('.script-uptime').html(script.uptime);
            });
        })
    },
    cmd: function(e, name){
        var $target = $(e.currentTarget);
        var cmd_ = $target.data('cmd');
        if($target.hasClass('js-script-output-live')){
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
        }else {
            Script.sendCommand(cmd_, function (response) {
                $("#scriptResponse").html(response.output);
            });
        }



    }
}; //END var Script



Script.init();


