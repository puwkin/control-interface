_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g};

$(function() {
    Module.init();
}); //END ready()

var Module = {
    _template: _.template(
        '<div id="{{id}}" class="moduleBox">' +
            '<div class="moduleBox-header">' +
                '<span class="moduleBox-title">{{config.name}}</span>' +
            '</div>' +
            '<div class="moduleBox-content"></div>' +
        '</div>'
    ),
    intervals: {},
    init: function(){
        _.each(moduleList, function(module){
            var interval = parseInt(module.config.interval * 1000, 10);
            $('#modulesContainer').append(Module._template(module));
            if(typeof module.config.width === 'undefined' || module.config.width <= 0){
                module.config.width = 200;
            }
            if(typeof module.config.height === 'undefined' || module.config.height <= 0){
                module.config.height = 200;
            }
            var $moduleBox = $("#"+module.id);
            $moduleBox.css({
                'min-width': module.config.width+"px"
            });
            $moduleBox.find('.moduleBox-content').css({
                'max-height': module.config.height+"px"
            });
            Module.loadModule(module);
            if(interval > 0) {
                Module.intervals[module.id] = window.setInterval(function () {
                    Module.loadModule(module);
                }, interval);
            }
        });
    },
    loadModule: function(module){
        $("#"+module.id).find('.moduleBox-content').load(module.index);
    }
}; //END var Module
