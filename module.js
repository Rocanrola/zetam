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
	load:function(methodName){
		var that = this;
		var controllerPath = path.resolve(this.path,'controller');
		var i18nPath = path.resolve(this.path,'i18n.json');

		this.controller = require(controllerPath);
		this.controller[methodName](this.req,this.conf,function(err,model,newConf){
			var conf = newConf || that.conf;

			var templateFileName = conf['data-template'] || 'template';
			var templatePath = path.resolve(that.path , templateFileName + '.html');
			
			that.model = model;
			that.template = fs.readFileSync(templatePath).toString();
			that.i18n = require(i18nPath);

			var data = { model: that.model, i18n:that.i18n }
			var html = mustache.render(that.template, data)

			that.onLoad(null,html);
		});
	}
}

module.exports = Module;