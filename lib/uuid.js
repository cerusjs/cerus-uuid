module.exports = function() {
	var self = {};

	var generate_uuid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	var uuids = [];

	self.uuids = function() {
		return uuids;
	}

	self.generate = function() {
		return uuids[uuids.length] = generate_uuid();
	}

	self.add = function(uuid) {
		uuids[uuids.length] = uuid;
	}

	self.remove = function(uuid) {
		for(var i = 0; i < uuids.length; i++) {
			if(uuids[i] == uuid) {
				uuids.splice(i, 1);
			}
		}
	}

	self.clear = function() {
		uuids = [];
	}

	self.check = function(uuid) {
		for(var i = 0; i < uuids.length; i++) {
			if(uuids[i] == uuid) {
				return true;
			}
		}

		return false;
	}

	self.test = function(uuid) {
		if(typeof uuid == 'string') {
			return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid);
		}
	}

	return self;
}