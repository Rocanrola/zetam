var path = require('path');
var fs = require('fs');
var utils = require('./utils');
var pages = require('./pages');


module.exports = function (req,res,next) {
	req.resource = utils.pathNameToresource(req._parsedUrl.pathname);
	router(req,res,next);	
}

var router = function(req,res,next){
	var pageName = req.resource.name || 'index';
	
	pages.load(pageName,req,function(err,page){
		if(!err){
			res.send(page);
		}else{
			next();
		}
	})
}