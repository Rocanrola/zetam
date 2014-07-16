var path = require('path');
var utils = require('./utils');
var Module = require('./module');
var Component = require('./component');
var $ = require('cheerio');
var async = require('async');

var Page = function(pageName){
	Module.apply(this,arguments);

	this.name = pageName || '';
}

Page.prototype = Object.create(Module.prototype);
Page.prototype.resolve = function(item){
	return path.resolve(path.dirname(require.main.filename),'pages',this.name,item);
}

Page.prototype.renderComponentTags = function(cb){
	var that = this;
	var pageDom = $.load(this.html);
    var componentTags = pageDom("[data-component]");

    async.forEach(componentTags, function(elem, callback) {
        var componentElement = $(elem);
	    var componentName = componentElement.data('component');
	    var component = new Component(componentName);

		component.req = that.req;
	    // We need duplicate attrs in another object because if we add globals to a simple reference it affect to original dom too
		component.conf = utils.cloneObject(componentElement.attr());
		component.conf.parent = that.model;

		component.render('init',function(err){
			if(!err){
				componentElement.html(component.html);
			}
			callback()
			
		});
    }, function(err) {
    	that.html = pageDom.html();
        cb(null);
    });
}
module.exports = Page;