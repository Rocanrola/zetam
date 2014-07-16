var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var Page = require('./page');

module.exports = function (req,res,next) {
	req.resource = utils.pathNameToresource(req._parsedUrl.pathname);
	router(req,res,next);	
}

var router = function(req,res,next){
	var pageName = req.resource.name || 'index';

	var page = new Page(pageName);
	page.req = req;
	page.conf = {};

	page.render(req.method.toLowerCase() || 'get',function(err){
		var that = this;
		if(err){
			next();
		}else{
			page.renderComponentTags(function(err){
				res.send(page.html);
			})
		}
		
	});

}