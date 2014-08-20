exports.get = function (conf,cb) {
	cb(null,{
		model:{
			componentName:conf.resource.id
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