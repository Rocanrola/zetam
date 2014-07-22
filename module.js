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
	pulli18n:function(locale){
		var i18nPath = this.resolve('i18n.json');
		var originali18n = {};

		if(fs.existsSync(i18nPath)){
			originali18n = require(i18nPath);
		}
		
		this.i18n = utils.mergei18n(originali18n,locale);
	},
	pullController:function(){
		var controllerPath = this.resolve('controller');
		
		if(fs.existsSync(controllerPath+'.js')){
			this.controller = require(controllerPath);
		}
	},
	render:function(methodName,cb){
		var that = this;
		this.pullController()

		if(!this.controller){
			cb({error:'CONTROLLER_NOT_FOUND'});
			return false;
		}

		this.controller[methodName](this.req,this.conf,function(err,model,newConf){
			that.conf = newConf || that.conf;
			
			if(that.req.config && that.req.config.locale){
				that.pulli18n(that.req.config.locale);
			}	

			var templateFileName = that.conf['data-template'] || 'template';
			var templatePath = that.resolve(templateFileName + '.html');
			that.template = fs.readFileSync(templatePath).toString();
			
			that.model = model;
			
			var data = { model: that.model, i18n:that.i18n }
			that.html = mustache.render(that.template, data);
			that.html = utils.minifyHTML(that.html);

			cb(null);
		});
	}
}

module.exports = Module;