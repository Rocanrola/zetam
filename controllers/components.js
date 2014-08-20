var load = require('../load');
var fs = require('fs');
var path = require('path');

exports.get = function (req,res,next) {
	var data = req.config;

	if(req.resource.subresource && req.resource.subresource.name == 'method' && req.resource.subresource.id){
		
		var methodName = req.resource.subresource.id;
		var componentPath = load.resolve('components/'+req.resource.id);
		var controller = load.moduleController(componentPath);

		if(controller && (methodName in controller)){
			var methodParams = req.query.jsonString ? JSON.parse(req.query.jsonString) : req.query;
			methodParams.config = req.config;
			controller[methodName].call(controller,methodParams,function(error,response){
				res.json({err:error,res:response});
			});
		}else{
			res.send(404);
		}

	}else if(req.resource.id){

		if(req.query.preview === 'true'){
			var pagePath = path.resolve(__dirname,'../','pages/components');
			
			load.page(pagePath,'get',data,function(err,page){
				res.send(page.html);
			})

		}else{
			load.component(req.resource.id,'init',req.query,function(err,component){
				if(err){
					res.send(404);
				}else{
					res.send(component.html);
				}
			})			
		}

	}else{
		res.send(404);
	}
}