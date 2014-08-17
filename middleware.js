var load = require('./load');
var utils = require('./utils');

module.exports = function (req,res,next) {
	req.resource = utils.pathNameToresource(req._parsedUrl.pathname);
	router(req,res,next);	
}

var router = function(req,res,next){
	var config = {}
	
	config.globals = req.config || {};
	config.globals.resource = req.resource;
	config.globals.cookies = req.cookies || null;

	var pageName = req.resource.name || 'index';
	var methodName = req.method.toLowerCase() || 'get';

	var controller = (pageName === 'components') ? require('./controllers/components') : load.controller(pageName);
	
	if(controller && (methodName in controller)){
		controller[methodName].call(controller,req,res,next);
	}else{
		load.page(pageName, methodName, config, function(err,page){
			if(!err){
				res.end(utils.minifyHTML(page.html));
			}else if(err.redirect){
				res.redirect(err.redirect.code || 301, err.redirect.url);
			}else{
				console.error(err);
				res.send(404);
			}
		});
	}

}