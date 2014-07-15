var path = require('path');
var utils = require('./utils');
var pagesDir = path.resolve(path.dirname(require.main.filename),'pages');


exports.load = function(pageName,req,cb) {
	var pageDir = path.resolve(pagesDir,pageName);

	utils.loadZetaModule({
		basePath:pageDir,
		methodName:req.method.toLowerCase() || 'get',
		data:req
	},cb);
}
