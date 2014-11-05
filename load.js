var path = require('path');
var fs = require('fs');
var Page = require('./page');
var Component = require('./component');
var utils = require('./utils');
var $ = require('cheerio');
var async = require('async');

var templateCacheEnable = false;
var templatesCache = {}

var basePaths = [path.resolve(path.dirname(require.main.filename))];
var allPaths = basePaths;
var objectSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

exports.controller = function (name) {
	var controllerPath = this.resolve('controllers/'+name+'.js');
	
	if(controllerPath){
		return require(controllerPath);
	}else{
		return false;
	}
}

exports.page = function(name,methodName,args,req,cb){
	var that = this;

		args = args || {};
		args.moduleName = name;
		methodName = methodName || 'get';

	var pagePath = (name.search('/') != -1) ? name : this.resolve('pages/'+name);
	
	if(pagePath){
		var page = new Page();
		this.moduleResourcesAndRender(page,pagePath,methodName,args,req,function(err){
			if(!err){
				that.renderComponentTags(page,function(err,newPage){
					cb.call(newPage,null,newPage);
				})	
			}else{
				cb(err);
			}
		})
	}else{
		cb({error:'page ' + name + ' path not found'});
	}
}

exports.component = function(name,methodName,args,req,cb){
	var that = this;
		
		args = args || {};
		args.moduleName = name;
		
		methodName = methodName || 'init';

	// if start with / is an absolute path
	var componentPath = /^(\/)/.test(name) ? name : this.resolve('components/'+name);
	
	if(componentPath){
		var component = new Component();

		this.moduleResourcesAndRender(component,componentPath,methodName,args,req,function(err){
			if(!err){
				that.renderComponentTags(component,function(err,newComponent){
					cb.call(newComponent,null,newComponent);
				})
			}else{
				cb(err);
			}
		})
			
	}else{
		cb({error:'component ' + name + ' path not found'});
	}
}

exports.moduleResourcesAndRender = function(module,modulePath,methodName,args,req,cb){
	var that = this;

	module.config = utils.cloneObject(args);
	module.req = req;
	module.controller = this.moduleController(modulePath);

	module.setModelAndConfigFromMethod(methodName,function(err){
		if(!err){
			module.i18n = that.moduleI18n(modulePath,module.req.config.locale);
			module.template = module.config['data-template-string'] || that.moduleTemplate(modulePath,module.config['data-template']);
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
	var templateCode;
	var templatePath = path.resolve(modulePath,templateName + '.html');

	if(templateCacheEnable && templatesCache[templatePath]){
		return templatesCache[templatePath];
	}

	if(fs.existsSync(templatePath)){
		templateCode = fs.readFileSync(templatePath).toString();
		templatesCache[templatePath] = templateCode;
		return templateCode;
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

exports.renderComponentTags = function(module,cb){
	var that = this;

	var pageDom = $.load(module.html);
    var componentTags = pageDom("[data-component]");


    async.forEach(componentTags, function(elem, callback) {
        var componentElement = $(elem);
	    var componentName = componentElement.data('component');
		
		var componentArgs = utils.cloneObject(componentElement.attr());
			componentArgs.innerHTML = componentElement.html();

	    that.component(componentName,'init',componentArgs,module.req,function(err,component){
	    	if(!err){
	    		componentElement.html(component.html);
	    	}
	    	callback();
	    })
    }, function(err) {
    	module.html = pageDom.html();
        cb(null,module);
    });
}

exports.enableTemplateCache = function(){
	templateCacheEnable = true;
}


exports.paths = function(newPaths){
	if(newPaths){
		allPaths = basePaths.concat(newPaths);
	}
	return allPaths;
}