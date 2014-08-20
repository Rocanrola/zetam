var path = require('path');
var fs = require('fs');
var mustache = require('mustache');

var Module = function (name) {
	this.model = {};
	this.i18n = {};
	this.config = {};
	this.template = '';
	this.html = '';
	this.controller = null;
}

Module.prototype = {
	render:function(cb){
		var data = { model: this.model, i18n:this.i18n, config:this.config }

		this.html = mustache.render(this.template, data);
		
		if(cb){
			cb.call(this,this.html);
		}
	},
	method:function(methodName,cb){
		if(this.controller && (methodName in this.controller)){
			this.controller[methodName](this.config,cb);
		}else{
			cb({error:'METHOD_NOT_FOUND_IN_CONTROLLER'});
		}
	},
	setModelAndConfigFromMethod:function(methodName,cb){
		var that = this;
		this.method(methodName,function(err,res){
			if(!err){
				that.model = res.model || that.model;
				that.config = res.config || that.config;
				cb(null,that);
			}else{
				cb(err)
			}
		})
	}
}

module.exports = Module;