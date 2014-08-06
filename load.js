var path = require('path');
var fs = require('fs');
var Page = require('./page');
var Component = require('./component');
var utils = require('./utils');

var basePaths = [path.resolve(path.dirname(require.main.filename))];
var allPaths = basePaths;

exports.controller = function (name) {
	var controllerPath = this.resolve('controllers/'+name+'.js');
	
	if(controllerPath){
		return require(controllerPath);
	}else{
		return false;
	}
}

exports.page = function(name,methodName,args,cb){
	var that = this;
	var pagePath;

	if(name.search('/') != -1){
		// is a path
		pagePath = name;
	}else{
		pagePath = this.resolve('pages/'+name);
	}
	
	if(pagePath){
		var page = new Page();

		args = args || {};

		this.loadModuleResources(page,args,pagePath);	
		page.loadModelFromMethodAndRender(methodName,args,function(){
			this.renderComponentTags(args,function(err){
				cb.call(page,null,page);
			})
		})
	}else{
		cb({error:'page ' + name + ' path not found'});
	}
}

exports.component = function(name,methodName,args,cb){
	var that = this;

	if(name.search('/') != -1){
		// is a path
		componentPath = name;
	}else{
		componentPath = this.resolve('components/'+name);
	}

	var component = new Component();

	args = args || {};

	this.loadModuleResources(component,args,componentPath);

	component.loadModelFromMethodAndRender(methodName,args,function(){
		cb.call(component,null,component);
	})
}

exports.loadModuleResources = function(obj,args,modulePath){
	if(!modulePath){
		return false;
	}

	args = args || {};
	args.globals = args.globals || {};

	var templateFileName = (args['data-template'] || 'template') + '.html';

	var controllerPath = path.resolve(modulePath,'controller');
	var i18nPath = path.resolve(modulePath,'i18n.json');
	var templatePath = path.resolve(modulePath,templateFileName);


	if(fs.existsSync(i18nPath)){
		obj.i18n = utils.mergei18n(require(i18nPath),args.globals.locale || 'ar');
	}

	if(fs.existsSync(templatePath)){
		obj.template = fs.readFileSync(templatePath).toString();
	}
	
	if(fs.existsSync(controllerPath+'.js')){
		obj.controller = require(controllerPath);
	}

}

exports.resolve = function(item){
	var paths = this.paths();

	for (var i = 0; i < paths.length; i++) {
		var currentPath = paths[i]+ '/' +item;
		if(fs.existsSync(currentPath)){
			return currentPath;
		}
	};

	return false;
}

exports.paths = function(newPaths){
	if(newPaths){
		allPaths = basePaths.concat(newPaths);
	}
	return allPaths;
}