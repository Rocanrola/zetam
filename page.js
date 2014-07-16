var path = require('path');
var Module = require('./module');

var pagesDir = path.resolve(path.dirname(require.main.filename),'pages');

var Page = function(pageName){
	Module.apply(this,arguments);
	this.path = path.resolve(pagesDir,pageName);
}

Page.prototype = Object.create(Module.prototype);

module.exports = Page;