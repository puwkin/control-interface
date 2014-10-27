_.templateSettings = {interpolate: /\{\{(.+?)\}\}/g};

$(function() {
    Module.init();
}); //END ready()

var Module = {
    _template: _.template(
        '<div id="{{id}}" class="module">' +
            '<div class="header">' +
                '<span class="title">{{name}}</span>' +
            '</div>' +
            '<div class="content"></div>' +
        '</div>'
    ),
    intervals: {},
    init: function(){
        _.each(moduleList, function(module){
            var interval = parseInt(module.interval * 1000, 10);
            $('#modulesContainer').append(Module._template(module));
            Module.loadModule(module);
            if(interval > 0) {
                Module.intervals[module.id] = window.setInterval(function () {
                    Module.loadModule(module);
                }, interval);
            }
        });
    },
    loadModule: function(module){
        $("#"+module.id).find('.content').load(module.index);
    }
}; //END var Module
