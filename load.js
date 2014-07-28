var path = require('path');
var fs = require('fs');
var Page = require('./page');
var utils = require('./utils');

var basePaths = [path.resolve(path.dirname(require.main.filename))];
var allPaths = basePaths;

exports.controller = function (name) {
	var controllerPath = path.resolve(rootDir,'controllers',name);
	if(fs.existsSync(controllerPath+'.js')){
		return require(controllerPath);
	}else{
		return false;
	}
}

exports.page = function(name,methodName,args,cb){
	var pagePath = this.resolve('pages/'+name)

	if(pagePath === false){
		return false;
	}

	var pageControllerPath = path.resolve(pagePath,'controller');
	var pageI18nPath = path.resolve(pagePath,'i18n.json');
	var pageTemplatePath = path.resolve(pagePath,'template.html');
	
	args = args || {};
	methodName = methodName.toLowerCase();

	var page = new Page();

	if(fs.existsSync(pageI18nPath)){
		page.i18n = utils.mergei18n(require(pageI18nPath),args.globals.locale);
	}

	if(fs.existsSync(pageTemplatePath)){
		page.template = fs.readFileSync(pageTemplatePath).toString();
	}

	if(fs.existsSync(pageControllerPath+'.js')){
		page.controller = require(pageControllerPath);	

		if(methodName && (methodName in page.controller)){
			page.controller[methodName](args,function(err,model){
				page.model = model || {};
				cb.call(page,err);
			})
		}else{
			console.error('method '+methodName + 'not found');
		}
		return page;
	}else{
		return false;
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