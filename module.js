var path = require('path');
var fs = require('fs');
var mustache = require('mustache');
var utils = require('./utils');

var Module = function (name) {
	this.model = {};
	this.i18n = {};
	this.template = '';
	this.html = '';
	this.controller = null;
}

Module.prototype = {
	render:function(cb){
		var data = { model: this.model, i18n:this.i18n }

		this.html = mustache.render(this.template, data);

		cb.call(this,this.html);

		// if(!this.controller){
		// 	cb({error:'CONTROLLER_NOT_FOUND'});
		// 	return false;
		// }

		// this.controller[methodName](this.req,this.conf,function(err,model,newConf){
		// 	that.conf = newConf || that.conf;
			
		// 	if(that.req.config && that.req.config.locale){
		// 		that.pulli18n(that.req.config.locale);
		// 	}	

		// 	var templateFileName = that.conf['data-template'] || 'template';
		// 	var templatePath = that.resolve(templateFileName + '.html');
		// 	that.template = fs.readFileSync(templatePath).toString();
			
		// 	that.model = model;
			
		// 	var data = { model: that.model, i18n:that.i18n }
		// 	that.html = mustache.render(that.template, data);
		// 	that.html = utils.minifyHTML(that.html);

		// 	cb(null);
		// });
	}
}

module.exports = Module;