var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
var utils = require('./utils');
var rootPath = path.resolve(path.dirname(require.main.filename));

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
	resolve:function(item){ return path.resolve(rootPath,this.name,item); },
	render:function(methodName,cb){
		var that = this;
		var controllerPath = this.resolve('controller');
		var i18nPath = this.resolve('i18n.json');
		
		if(!fs.existsSync(controllerPath+'.js')){
			cb({error:'CONTROLLER_NOT_FOUND'});
			return false;
		}

		this.controller = require(controllerPath);
		this.controller[methodName](this.req,this.conf,function(err,model,newConf){
			that.conf = newConf || that.conf;

			var templateFileName = that.conf['data-template'] || 'template';
			var templatePath = that.resolve(templateFileName + '.html');
			var originali18n = require(i18nPath)
			
			that.model = model;
			that.template = fs.readFileSync(templatePath).toString();

			if(that.req.config && that.req.config.locale){
				that.i18n = utils.mergei18n(originali18n,that.req.config.locale);
			}

			var data = { model: that.model, i18n:that.i18n }
			that.html = mustache.render(that.template, data)

			cb(null);
		});
	}
}

module.exports = Module;