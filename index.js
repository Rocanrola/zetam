// exports.middleware = require('./middleware');
exports.load = require('./load');

exports.gulp = function(gulp,conf){
	var zetamGulpConf = require('./gulp');
	zetamGulpConf.apply(zetamGulpConf,arguments);
};

exports.middleware = function(){
	var zetamMiddleware = require('./middleware');
	zetamMiddleware.apply(zetamMiddleware,arguments);
};