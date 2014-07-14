var path = require('path');
var components = require('./components');
var utils = require('./utils');
var pagesDir = path.resolve(path.dirname(require.main.filename),'pages');


exports.load = function(pageName,req,cb) {
	var pageDir = path.resolve(pagesDir,pageName);

	utils.loadZetaModule({
		basePath:pageDir,
		methodName:req.method.toLowerCase() || 'get',
		data:req
	},function(err,page){
		
		if(err){
			cb(err);
			return false;
		}else{
			components.renderComponentTags(page.html, page.data.model, function(err,pageFinalHTML){
				cb(null,pageFinalHTML)
			})
		}

	});
}
