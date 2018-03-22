class uuid {
	constructor(type = "v4") {
		this._uuids = [];
		this._type = type;
	}

	type(type) {
		if(typeof type === "string") {
			this._type = type;
		}

		return this._type;
	}

	generate(options = {}) {
		var uuid;

		switch(this._type) {
			case "v1":
				uuid = uuidv1(options);
				break;
			case "v3":
				if(typeof options["name"] !== "string") {
					throw new TypeError("the option name must be a string");
				}

				if(typeof options["namespace"] !== "string") {
					throw new TypeError("the option namespace must be a string");
				}

				uuid = uuidv3(options);
				break;
			case "v5":
				if(typeof options["name"] !== "string") {
					throw new TypeError("the option name must be a string");
				}

				if(typeof options["namespace"] !== "string") {
					throw new TypeError("the option namespace must be a string");
				}

				uuid = uuidv5(options);
				break;
			case "v4":
			default:
				uuid = uuidv4(options);
				break;
		}

		if(this.has(uuid)) {
			if((this._type === "v3" || this._type === "v5") 
				&& typeof options["name"] === "string" 
				&& typeof options["namespace"] === "string") {
				throw new Error("the options name and namespace are already used for a uuid causing a stack overflow");
			}

			return this.generate(options);
		}

		this.add(uuid);

		return uuid;
	}

	add(uuid) {
		if(typeof uuid !== "string") {
			throw new TypeError("the argument uuid must be a string");
		}

		if(!this.check(uuid)) {
			throw new Error("the specified uuid is incorrect");
		}

		if(this.has(uuid)) {
			throw new Error("the specified uuid has already been added");
		}

		this._uuids.push(uuid);
	}

	has(uuid) {
		if(typeof uuid !== "string") {
			throw new TypeError("the argument uuid must be a string");
		}

		return this._uuids.includes(uuid);
	}

	remove(uuid) {
		if(typeof uuid !== "string") {
			throw new TypeError("the argument uuid must be a string");
		}

		if(!this.has(uuid)) {
			throw new Error("the specified uuid hasn't been added yet");
		}

		this._uuids.splice(this._uuids.indexOf(uuid), 1);
	}

	clear() {
		this._uuids = [];
	}

	check(uuid) {
		var parsed = uuid;

		if(typeof parsed !== "string") {
			return false;
		}

		parsed = parsed.toLowerCase();

		if(!(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(parsed))) {
			return false;
		}

		var version = this.version(parsed);

		if(this.type() !== version) {
			return false;
		}

		switch(version) {
			case "v1":
				return true;

			case "v3":
			case "v4":
			case "v5":
				return ["a", "b", "8", "9"].indexOf(parsed.charAt(19)) !== -1;
		}
	}

	version(uuid) {
		if(typeof uuid !== "string") {
			throw new TypeError("the argument uuid must be a string");
		}

		var version = uuid.charAt(14);

		if(version !== "1" && version !== "3" && version !== "4" && version !== "5") {
			throw new TypeError("the inserted uuid is incorrect");
		}

		return "v" + version;
	}
}

var uuidv1 = function(options) {
	return require("uuid/v1")(options, options["buffer"], options["offset"]);
};

var uuidv3 = function(options) {
	return require("uuid/v3")(options["name"], options["namespace"], options["buffer"], options["offset"]);
};

var uuidv4 = function(options) {
	return require("uuid/v4")(options, options["buffer"], options["offset"]);
};

var uuidv5 = function(options) {
	return require("uuid/v5")(options["name"], options["namespace"], options["buffer"], options["offset"]);
};

module.exports = uuid;

// These namespace can be added if needed
/***
var namespaces = function() {
	this._namespaces = {};
};

namespaces.prototype.add = function(key, value) {
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}

	if(typeof value !== "string") {
		throw new TypeError("the argument value must be a string");
	}

	this._namespaces[key] = value;
};

namespaces.prototype.get = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}

	return this._namespaces[key];
};

namespaces.prototype.has = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}

	return this._namespaces[key] !== undefined;
};

namespaces.prototype.remove = function(key) {
	if(typeof key !== "string") {
		throw new TypeError("the argument key must be a string");
	}

	delete this._namespaces[key];
};

namespaces.prototype.clear = function() {
	this._namespaces = {};
};

namespaces.prototype.list = function() {
	return Object.keys(this._namespaces);
};

namespaces.prototype.dns = function() {
	return "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
};

namespaces.prototype.url = function() {
	return "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
};

namespaces.prototype.oid = function() {
	return "6ba7b812-9dad-11d1-80b4-00c04fd430c8";
};

namespaces.prototype.x500 = function() {
	return "6ba7b814-9dad-11d1-80b4-00c04fd430c8";
};
***/