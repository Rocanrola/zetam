var path = require('path');
var utils = require('./utils');
var Module = require('./module');
var fs = require('fs');
var rootDir = path.resolve(path.dirname(require.main.filename));

var Component = function(componentName){
	Module.apply(this,arguments);

	this.name = componentName || '';
}

Component.prototype = Object.create(Module.prototype);
Component.prototype.resolve = function(item){
	var allThePaths = config.componentPaths();

	for (var i = 0; i < allThePaths.length; i++) {
		var aPath = allThePaths[i];
		var componentPath = path.resolve(rootDir,aPath,this.name);

		if(fs.existsSync(componentPath)){
			return path.resolve(componentPath,item);
		}
	};
	return false;
}

module.exports = Component;