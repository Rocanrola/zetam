// exports.middleware = require('./middleware');
exports.load = require('./load');
var forcedPage = null;

exports.gulp = function(gulp,conf){
	var zetamGulpConf = require('./gulp');
	zetamGulpConf.apply(zetamGulpConf,arguments);
};

exports.middleware = function(){
	var zetamMiddleware = require('./middleware');
	zetamMiddleware.apply(zetamMiddleware,arguments);
};

exports.setForcedPageName = function(pageName){
	forcedPage = pageName;
}
exports.getForcedPageNameAndDelete = function(pageName){
	var tmp = forcedPage;
	forcedPage = null;
	return tmp;
}