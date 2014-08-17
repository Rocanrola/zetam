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
		args = args || {};
		args.moduleName = name;
		methodName = methodName || 'get';

	var pagePath = (name.search('/') != -1) ? name : this.resolve('pages/'+name);
	
	if(pagePath){

		var page = new Page();
		this.moduleResourcesAndRender(page,pagePath,methodName,args,function(err){
			if(!err){
				page.renderComponentTags(function(err){
					cb.call(page,null,page);
				})	
			}else{
				cb(err);
			}
		})
	}else{
		cb({error:'page ' + name + ' path not found'});
	}
}

exports.component = function(name,methodName,args,cb){
	var that = this;
		args = args || {};
		args.moduleName = name;
		methodName = methodName || 'init';

	var componentPath = (name.search('/') != -1) ? name : this.resolve('components/'+name);

	if(componentPath){
		var component = new Component();

		this.moduleResourcesAndRender(component,componentPath,methodName,args,function(err){
			if(!err){
				cb.call(component,null,component);	
			}else{
				cb(err);
			}
		})
			
	}else{
		cb({error:'component ' + name + ' path not found'});
	}
}

exports.moduleResourcesAndRender = function(module,modulePath,methodName,args,cb){
	var that = this;

	module.config = utils.cloneObject(args);
	module.controller = this.moduleController(modulePath);

	module.setModelAndConfigFromMethod(methodName,function(err){
		if(!err){
			module.i18n = that.moduleI18n(modulePath,module.config.globals.locale);
			module.template = that.moduleTemplate(modulePath,module.config['data-template']);
			module.render(function(){
				cb.call(module,null,module);
			});
		}else{
			cb(err);
		}
	});
}

exports.moduleController = function(modulePath){
	var controllerPath = path.resolve(modulePath,'controller');
	
	if(fs.existsSync(controllerPath+'.js')){
		return require(controllerPath);
	}else{
		return null;
	}
}
exports.moduleI18n = function(modulePath,locale){
	var i18nPath = path.resolve(modulePath,'i18n.json');

	if(fs.existsSync(i18nPath)){
		var i18n = require(i18nPath);
		return utils.mergei18n(i18n, locale || 'ar');
	}else{
		return null;
	}
}

exports.moduleTemplate = function(modulePath, templateName){
	templateName = templateName || 'template';

	var templatePath = path.resolve(modulePath,templateName + '.html');
	if(fs.existsSync(templatePath)){
		return fs.readFileSync(templatePath).toString();
	}else{
		return null;
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