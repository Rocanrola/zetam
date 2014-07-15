var baseComponentPaths = ['components'];
var allComponentPaths = baseComponentPaths;
var currentLocale;

exports.componentPaths = function (newPaths) {
	if(newPaths){
		allComponentPaths = baseComponentPaths.concat(newPaths);
	}
	
	return allComponentPaths;
}

exports.locale = function(newLocale){
	if(newLocale){
		currentLocale = newLocale;
	}

	return currentLocale;
}