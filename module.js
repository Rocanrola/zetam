var path = require('path');
var fs = require('fs');
var mustache = require('mustache');

var Module = function (name) {
	this.name = name || '';
	this.req = {};
	this.conf = {};
	this.model = {};
	this.i18n = {};
	this.path = '';
	this.template = '';
	this.controller = null;
}

Module.prototype = {
	onLoad:function(){},
	execute:function(methodName,cb){
		var that = this;
		var controllerPath = path.resolve(this.basePath,this.name,'controller');
		var i18nPath = path.resolve(this.basePath,this.name,'i18n.json');
		
		if(!fs.existsSync(controllerPath+'.js')){
			cb({error:'CONTROLLER_NOT_FOUND'});
			return false;
		}

		this.controller = require(controllerPath);
		this.controller[methodName](this.req,this.conf,function(err,model,newConf){
			var conf = newConf || that.conf;

			var templateFileName = conf['data-template'] || 'template';
			var templatePath = path.resolve(that.basePath, that.name, templateFileName + '.html');
			
			that.model = model;
			that.template = fs.readFileSync(templatePath).toString();
			that.i18n = require(i18nPath);

			var data = { model: that.model, i18n:that.i18n }
			that.html = mustache.render(that.template, data)

			cb(null,that.html);
		});
	}
}

module.exports = Module;