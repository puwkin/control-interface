_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g};

var Script = {
    _template: _.template(
        '<div id="script-{{name}}">' +
        '   <span class="script-status"></span>' +
        '   <span class="script-name">{{name}}</span>' +
        '   <span class="script-uptime">{{uptime}}</span>' +
        '</div>'
    ),
    init: function(){
        $.getJSON("./modules/pyCtrl/getScriptData.php",function(scripts){
            console.log("in getJSON");
            console.log(scripts);
            _.each(scripts.all, function(script){
                $('#scriptsContainer').append(Script._template(script));
            });
        }).done(function() {
            var refreshInt = setInterval(Script.refreshList, 1000);
        });
    },
    refreshList: function(){
        $.getJSON("./modules/pyCtrl/getScriptData.php",function(scripts){
            _.each(scripts.all, function(script) {
                var color = 'gray';
                if (script.enabled) {
                    if (script.running) {
                        color = 'red';
                    } else if (!script.running) {
                        color = 'green';
                    }
                }
                $("#script-"+script.name).find('.script-status').css({
                    backgroundColor: color
                });
                $("#script-"+script.name).find('.script-uptime').html(script.uptime);
            });
        })
    }
}; //END var Script



Script.init();


