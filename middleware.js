var load = require('./load');
var utils = require('./utils');

module.exports = function (req,res,next) {
	req.resource = utils.pathNameToresource(req._parsedUrl.pathname);
	
	router(req,res,next);	
}

var router = function(req,res,next){
	

	var pageName = req.resource.name || 'index';
	var methodName = req.method.toLowerCase() || 'get';

	var controller = (pageName === 'components') ? require('./controllers/components') : load.controller(pageName);
	
	if(controller){
		controller.init.call(controller,req,res,next);
	}else{
		load.page(pageName, methodName, req.config, req, function(err,page){
			if(!err){
				res.end(utils.minifyHTML(page.html));
			}else if(err.redirect){
				res.redirect(err.redirect.code || 301, err.redirect.url);
			}else{
				// console.error(err);
				res.status(404).end();
			}
		});
	}

}