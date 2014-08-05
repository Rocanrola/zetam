var load = require('./load');
var utils = require('./utils');

module.exports = function (req,res,next) {
	req.resource = utils.pathNameToresource(req._parsedUrl.pathname);
	router(req,res,next);	
}

var router = function(req,res,next){
	var data = {
		globals:req.config || config
	}

	var pageName = req.resource.name || 'index';
	var methodName = req.method.toLowerCase() || 'get';

	var controller = load.controller(pageName);
	
	if(pageName === 'components'){
		require('./controllers/components').call(controller,req,res,next);
	}else if(controller){
		controller[methodName].call(controller,req,res,next);
	}else{
		load.page(pageName, methodName, data, function(err,page){
			if(!err){
				res.end(utils.minifyHTML(page.html));
			}else{
				console.error(err);
				res.send(404);
			}
		});
	}

}