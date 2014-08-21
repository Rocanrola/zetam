exports.get = function (conf,req,cb) {
	cb(null,{
		model:{
			componentName:req.resource.id,
			componentAttrs:queryToAttrs(req.query)
		}
	});
}

var queryToAttrs = function(query){
	var attrs = ''
	for(var i in query){
		attrs += i + '=' + '"' + query[i] + '"';
	}
	return attrs;
}