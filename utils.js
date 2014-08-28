var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
var htmlminifier = require('html-minifier');

exports.pathNameToresource = function(pathname){
    var urlPath = pathname.replace('/', '').split('/');
    
    var root = lastResource = {};

    for (var i = 0; i < urlPath.length; i=i+2) {
        lastResource = lastResource.subresource = {};
        lastResource['name'] = urlPath[i];
        lastResource['id'] = (urlPath[i+1] || null);
    };

    root.subresource.name = root.subresource.name || 'index';
    return root.subresource;
}

exports.cloneObject = function(a) {
   return JSON.parse(JSON.stringify(a));
}

exports.minifyHTML = function(html){
	return htmlminifier.minify(html, {
		removeComments:true,
		collapseWhitespace:true,
		collapseBooleanAttributes:true,
		removeAttributeQuotes:true,
		useShortDoctype:true,
		removeEmptyAttributes:true
	});
}

exports.mergei18n = function(source,locale){
	merged = {}
    for(var i in source.all){
        merged[i] = source.all[i];
    }

    for(var i in source[locale]){
        merged[i] = source[locale][i];
    }
    
    merged.locale = locale;
    merged[locale] = true;

    return merged;
}

exports.mergeObjects = function(target,source){
	merged = {}
	
	for(var i in target){
        merged[i] = target[i];
    }

	for(var i in source){
        merged[i] = source[i];
    }
    
    return merged;
}

exports.loadZetaModule = function(conf,cb){
	var basePath = conf.basePath;
	var methodName = conf.methodName;
	var params = conf.data || {};
	var controllerPath = path.resolve(basePath,'controller');
	var i18nPath = path.resolve(basePath,'i18n.json');
	
	if(!fs.existsSync(controllerPath+'.js')){
		cb({error: controllerPath+' controller not found'})
		return false;
	}

	var controller = require(controllerPath);

	controller[methodName].call(controller, params, function(err,moduleModel,resParams){
		params = resParams || params;

		var templateFileName = params['data-template'] || 'template';
		var templatePath = path.resolve(basePath, templateFileName + '.html');
		var template = fs.readFileSync(templatePath).toString();

		var modulei18n = require(i18nPath);
		var data = { model: moduleModel, i18n:modulei18n }

		var html = mustache.render(template, data)

		cb(null,{
			html:html,
			data:data
		});
	});
}