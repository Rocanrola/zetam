var load = require('./load');
var utils = require('./utils');
var z = require('./');

module.exports = function (req,res,next) {
	req.resource = utils.pathNameToresource(req._parsedUrl.pathname);
	
	router(req,res,next);	
}

var router = function(req,res,next){
	var pageName = z.getForcedPageNameAndDelete() || req.resource.name || 'index';

	var methodName = req.method.toLowerCase() || 'get';
	var controller = (pageName === 'components') ? require('./controllers/components') : load.controller(pageName);

	var pageConfig = utils.cloneObject(req.config || {});
		pageConfig = utils.mergeObjects(pageConfig,req.query);
	
	if(controller){
		controller[methodName].call(controller,req,res,next);
	}else{
		load.page(pageName, methodName, pageConfig, req, function(err,page){
			if(!err){
				res.end(utils.minifyHTML(page.html));
			}else if(err.redirect){
				res.redirect(err.redirect.code || 301, err.redirect.url);
			}else{
				// console.error(err);
				next();
			}
		});
	}

}