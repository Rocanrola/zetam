var path = require('path');
var utils = require('./utils');
var Module = require('./module');

var Page = function(pageName){
	Module.apply(this,arguments);

	this.name = pageName || '';
}

Page.prototype = Object.create(Module.prototype);
Page.prototype.resolve = function(pageName){
	return path.resolve(path.dirname(require.main.filename),'pages',pageName);
}

Page.prototype.renderComponentTags = function(cb){
	var that = this;
	var pageDom = $.load(this.html);
    var componentTags = pageDom("[data-component]");

    async.forEach(componentTags, function(elem, callback) {
        var componentElement = $(elem);
	    var componentName = componentElement.data('component');
	    
	    // We need duplicate attrs in another object because if we add globals to a simple reference it affect to original dom too
	    var data = utils.cloneObject(componentElement.attr());
	    	data.parent = that.model;

    	that.load(componentName, data, function(err,componentHTML){
    		if(!err){
    			componentElement.html(componentHTML);
    		}
    		callback();
    	});
    }, function(err) {
        cb(null,pageDom.html());
    });
}
module.exports = Page;