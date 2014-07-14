var baseComponentPaths = ['components'];
var allComponentPaths = baseComponentPaths;

exports.componentPaths = function (newPaths) {
	if(newPaths){
		allComponentPaths = baseComponentPaths.concat(newPaths);
		return allComponentPaths;
	}else{
		return allComponentPaths;
	}
}