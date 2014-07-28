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
	var methodName = req.method || 'get';

	load.page(pageName, methodName, data, function(err){
		this.render(function(){
			res.end(this.html);
		})
	});
}