module.exports = class uuid {
	constructor(type = "v4") {
		this._uuids = [];
		this._type = type;
	}

	type(type) {
		if(type === undefined) return this._type;

		return this._type = type;
	}

	generate(options = {}) {
		let uuid;

		switch(this._type) {
			case "v1":
				uuid = this._uuidv1(options);
				break;
			case "v3":
				uuid = this._uuidv3(options);
				break;
			case "v5":
				uuid = this._uuidv5(options);
				break;
			case "v4":
			default:
				uuid = this._uuidv4(options);
				break;
		}

		if(this.has(uuid)) {
			if(this._may_overflow(options)) {
				throw new Error("the options name and namespace are already used for a uuid causing a stack overflow");
			}

			return this.generate(options);
		}

		this.add(uuid);

		return uuid;
	}

	_may_overflow(options) {
		return (this._type === "v3" || this._type === "v5")
			&& options["name"] !== undefined
			&& options["namespace"] !== undefined;
	}

	_uuidv1({node, clockseq, msecs, nsecs, buffer, offset}) {
		return require("uuid/v1")({node, clockseq, msecs, nsecs}, buffer, offset);
	}

	_uuidv3({name, namespace, buffer, offset}) {
		return require("uuid/v3")(name, namespace, buffer, offset);
	}

	_uuidv4({random, rng, buffer, offset}) {
		return require("uuid/v4")({random, rng}, buffer, offset);
	}

	_uuidv5({name, namespace, buffer, offset}) {
		return require("uuid/v5")(name, namespace, buffer, offset);
	}

	add(uuid) {
		if(!this.check(uuid)) {
			throw new Error("the specified uuid is incorrect");
		}

		if(this.has(uuid)) {
			throw new Error("the specified uuid has already been added");
		}

		this._uuids.push(uuid);
	}

	has(uuid) {
		return this._uuids.includes(uuid);
	}

	remove(uuid) {
		if(!this.has(uuid)) {
			throw new Error("the specified uuid hasn't been added yet");
		}

		this._uuids.splice(this._uuids.indexOf(uuid), 1);
	}

	clear() {
		this._uuids = [];
	}

	check(uuid) {
		let parsed = uuid;

		if(typeof parsed !== "string") {
			return false;
		}

		parsed = parsed.toLowerCase();

		if(!(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(parsed))) {
			return false;
		}

		const version = this.version(parsed);

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
		const version = uuid.charAt(14);

		if(version !== "1" && version !== "3" && version !== "4" && version !== "5") {
			throw new TypeError("the inserted uuid is incorrect");
		}

		return "v" + version;
	}
}