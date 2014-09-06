var Module = require('./module');
var utils = require('./utils');

var Page = function(pageName){
	// super()
	Module.apply(this,arguments);
}

// extiende Module
Page.prototype = Object.create(Module.prototype);

module.exports = Page;