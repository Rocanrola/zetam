console.log(require.resolve('component'))
//var Component = require('../component');

exports.get = function (req,conf,cb) {
	// var response = {};
	// 	response.componentName = req.resource.id;
	// 	response.componentName

	
	// if(req.query.preview === "true"){
	// 	cb(null,response);
 //    }else{
 //    	cb(null,response,{"data-template":"plain"});
 //    }

 	var componentName = req.resource.id;

 	if(componentName){
 		var component = new Component(componentName);

		component.req = req;
	    // We need duplicate attrs in another object because if we add globals to a simple reference it affect to original dom too
		component.conf = req.query;

		component.render('init',function(err){
			cb(null,{componentHTML:component.html},{"data-template":"plain"});
			
		});
 	}
	
}