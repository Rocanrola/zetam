var Module = require('./module');
var $ = require('cheerio');
var async = require('async');
var load = require('./load');
var utils = require('./utils');

var Page = function(pageName){
	// super()
	Module.apply(this,arguments);
}

// extiende Module
Page.prototype = Object.create(Module.prototype);

Page.prototype.renderComponentTags = function(cb){
	var that = this;

	var pageDom = $.load(this.html);
    var componentTags = pageDom("[data-component]");


    async.forEach(componentTags, function(elem, callback) {
        var componentElement = $(elem);
	    var componentName = componentElement.data('component');
		
		var componentArgs = utils.cloneObject(componentElement.attr());
			componentArgs.globals = that.config.globals || {};

	    load.component(componentName,'init',componentArgs,function(err,component){
	    	if(!err){
	    		componentElement.html(component.html);
	    	}
	    	callback();
	    })
    }, function(err) {
    	that.html = pageDom.html();
        cb(null);
    });
}

module.exports = Page;