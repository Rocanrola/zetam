var load = require('./load');
var utils = require('./utils');

module.exports = function (req,res,next) {
	req.resource = utils.pathNameToresource(req._parsedUrl.pathname);
	router(req,res,next);	
}

var router = function(req,res,next){
	var data = {}
	
	data.globals = req.config || {};
	data.globals.resource = req.resource;

	var pageName = req.resource.name || 'index';
	var methodName = req.method.toLowerCase() || 'get';

	var controller = (pageName === 'components') ? require('./controllers/components') : load.controller(pageName);
	
	if(controller){
		controller.call(controller,req,res,next);
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