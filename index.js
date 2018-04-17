module.exports = function() {
	var plugin = {};
	var package = require("./package.json");
	
	plugin.name = package["name"];
	plugin.version = package["version"];
	plugin.uuid = function(type) {
		return new (require("./lib/uuid"))(type);
	}

	return plugin;
}