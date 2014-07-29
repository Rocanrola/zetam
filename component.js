var Module = require('./module');


var Component = function(pageName){
	// super()
	Module.apply(this,arguments);
}

// extiende Module
Component.prototype = Object.create(Module.prototype);


module.exports = Component;
