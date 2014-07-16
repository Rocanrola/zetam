var path = require('path');
var utils = require('./utils');
var Module = require('./module');
var config = require('./config');
var fs = require('fs');
var rootDir = path.resolve(path.dirname(require.main.filename));

var Component = function(pageName){
	Module.apply(this,arguments);

	this.name = pageName || '';
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

// var path = require('path');
// var fs = require('fs');
// var utils = require('./utils');
// var $ = require('cheerio');
// var async = require('async');


// exports.resolve = function(componentName){
// 	var allThePaths = config.componentPaths();

// 	for (var i = 0; i < allThePaths.length; i++) {
// 		var aPath = allThePaths[i];
// 		var componentPath = path.resolve(rootDir,aPath,componentName);
// 		if(fs.existsSync(componentPath)){
// 			return componentPath;
// 		}
// 	};
// 	return false;
// }

// exports.load = function(componentName,config,cb){
// 	var componentDir = this.resolve(componentName);
// 	if(componentDir){
// 		utils.loadZetaModule({
// 			basePath:componentDir,
// 			methodName:'init',
// 			data:config
// 		},function(err,component){
// 			cb(null,component.html);
// 		})
// 	}else{
// 		cb({error:'COMPONENT_DIR_NOT_FOUND'})
// 	}
// }


// exports.renderComponentTags = function(html,parentData,cb){
// 	var that = this;
// 	var pageDom = $.load(html);
//     var componentTags = pageDom("[data-component]");

//     async.forEach(componentTags, function(elem, callback) {
//         var componentElement = $(elem);
// 	    var componentName = componentElement.data('component');
	    
// 	    // We need duplicate attrs in another object because if we add globals to a simple reference it affect to original dom too
// 	    var data = utils.cloneObject(componentElement.attr());
// 	    	data.parent = parentData || {};

//     	that.load(componentName, data, function(err,componentHTML){
//     		if(!err){
//     			componentElement.html(componentHTML);
//     		}
//     		callback();
//     	});
//     }, function(err) {
//         cb(null,pageDom.html());
//     });
// }
