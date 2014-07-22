var path = require('path');
var fs = require('fs');
var paths = [path.resolve(path.dirname(require.main.filename))];

exports.controller = function (name) {
	var controllerPath = path.resolve(rootDir,'controllers',name);
	if(fs.existsSync(controllerPath+'.js')){
		return require(controllerPath);
	}else{
		return false;
	}
}

exports.page = function(name){

}

exports.paths = function(newPaths){
	if(newPaths){
		paths = baseComponentPaths.concat(newPaths);
	}
	return paths;
}