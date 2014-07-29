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
		
		if(cb){
			cb.call(this,this.html);
		}
	},
	loadModelFromMethodAndRender:function(methodName,args,cb){
		var that = this;

		if(this.controller && (methodName in this.controller)){
			this.controller[methodName](args,function(err,model){
				if(!err && model){
					that.model = model;
					
					that.render(function(){
						cb.call(that);
					});
				}else{
					cb({error:'SOMETHING_WRONG_WITH_METHOD'})
				}
			})
		}
	}
}

module.exports = Module;