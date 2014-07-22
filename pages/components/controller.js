var Component = require('../../component');

exports.get = function (req,conf,cb) {
 	
  	var componentName = req.resource.id;
 	var componentAttrs = queryToAttrs(req.query);

 	if(!componentName){
 		cb({error:'NO_COMPONENT_NAME'});
 		return false;
 	}

 	if(req.query.preview === 'true'){
 		cb(null,{componentName:componentName,componentAttrs:componentAttrs},{'data-template':'template'});
 	}else{
 		var component = new Component(componentName);

		component.req = req;
		component.conf = req.query;

		if(req.resource.subresource && req.resource.subresource.name){
			component.pullController();
			var methodName = req.resource.subresource.name;
			if(methodName in component.controller){
				component.controller[methodName].call(component.controller,{},req.query,function(err,response){
                    req.res.json(response);
                });
			}
		}else{
			component.render('init',function(err){
				cb(null,{content:component.html},{'data-template':'plain'});
			});
		}

 	}

	
}

var queryToAttrs = function(query){
	var attrs = ''
	for(var i in query){
		attrs += i + '=' + '"' + query[i] + '"';
	}
	return attrs;
}