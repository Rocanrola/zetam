var load = require('../load');
var fs = require('fs');
var path = require('path');

module.exports = function (req,res,next) {
	var data = req.query;
		data.globals = req.config || {};


	if(req.resource.subresource && req.resource.subresource.name == 'method' && req.resource.subresource.id){
		
		var methodName = req.resource.subresource.id;
		var componentPath = load.resolve('components/'+req.resource.id);
		var controller = load.moduleController(componentPath);

		if(controller){
			controller[methodName].call(controller,req.query,function(response){
				res.json(response);
			});
		}else{
			res.send(404);
		}

	}else if(req.resource.id){

		if(req.query.preview === 'true'){
			var pagePath = path.resolve(__dirname,'../','pages/components');
			
			var data = {
				resource:req.resource,
				query:req.query,
				globals:req.config
			}
			
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