var plugin = require("../index")();
var expect = require("chai").expect;
var uuid = plugin.uuid;

describe("uuid", function() {
	describe("constructor", function() {
		context("with no parameters", function() {
			it("shouldn't throw any errors", function() {
				var func = function() {
					uuid();
				}

				expect(func).to.not.throw();
			});
		});
		
		context("with a custom type", function() {
			it("shouldn't throw any errors", function() {
				var func = function() {
					uuid("v4");
				}

				expect(func).to.not.throw();
			});
		});
	});

	describe("#type", function() {
		context("with no parameters", function() {
			it("should return the default type", function() {
				var uuid_ = uuid();
				expect(uuid_.type()).to.equal(uuid_._type);
			});
		});

		context("with incorrect parameters", function() {
			it("should return the default type", function() {
				var uuid_ = uuid();
				expect(uuid_.type(1234)).to.equal(uuid_._type);
			});
		});

		context("with a string as parameters", function() {
			it("should now use the new type", function() {
				var uuid_ = uuid();
				expect(uuid_.type()).to.equal(uuid_._type);
				uuid_.type("v3");
				expect(uuid_.type()).to.equal("v3");
			});
		});
	});

	describe("#generate", function() {
		context("with the v1 type", function() {
			it("should generate an uuid", function() {
				var uuid_ = uuid("v1").generate();
				expect(uuid_).to.be.a("string");
			});
		});

		context("with the v3 type", function() {
			context("and no name", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						uuid("v3").generate({namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
					}

					expect(func).to.throw();
				});
				
			});

			context("and no namespace", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						uuid("v3").generate({name: "test"});
					}

					expect(func).to.throw();
				});
			});

			context("and the correct options", function() {
				it("should generate an uuid", function() {
					var uuid_ = uuid("v3").generate({name: "test", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
					expect(uuid_).to.be.a("string");
				});
			})
		});

		context("with the v4 type", function() {
			it("should generate an uuid", function() {
				var uuid_ = uuid("v4").generate();
				expect(uuid_).to.be.a("string");
			});
		});

		context("with the v5 type", function() {
			context("and no name", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						uuid("v5").generate({namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
					}

					expect(func).to.throw();
				});
				
			});

			context("and no namespace", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						uuid("v5").generate({name: "test"});
					}

					expect(func).to.throw();
				});
			});

			context("and the correct options", function() {
				it("should generate an uuid", function() {
					var uuid_ = uuid("v5").generate({name: "test", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
					expect(uuid_).to.be.a("string");
				});
			})
		});

		context("causing a stack overflow by regenerating a fixed uuid", function() {
			it("should throw an Error", function() {
				var func = function() {
					var uuid_ = uuid("v5");
					uuid_.generate({name: "test", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
					uuid_.generate({name: "test", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
				}
				
				expect(func).to.throw();
			});
		});
	});

	describe("#add", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					uuid().add();
				}

				expect(func).to.throw();
			});
		});

		context("with incorrect parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					uuid().add(1234);
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect uuid (format)", function() {
			it("should throw an Error", function() {
				var func = function() {
					uuid().add("abcd-efgh-ijkl-mnop");
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect uuid (version)", function() {
			it("should throw an Error", function() {
				var func = function() {
					uuid().add("6ba7b810-9dad-11d1-80b4-00c04fd430c8");
				}

				expect(func).to.throw();
			});
		});

		context("with a correct uuid", function() {
			it("should add the uuid", function() {
				var uuid_ = uuid();
				uuid_.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");

				expect(uuid_._uuids.length).to.equal(1);
			});
		});

		context("with an already added uuid", function() {
			it("should throw an Error", function() {
				var func = function() {
					var uuid_ = uuid();
					uuid_.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
					uuid_.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				}

				expect(func).to.throw();
			});
		});
	});

	describe("#remove", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					uuid().remove();
				}

				expect(func).to.throw();
			});
		});

		context("with incorrect parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					uuid().remove(1234);
				}

				expect(func).to.throw();
			});
		});

		context("with an uuid that hasn't been added", function() {
			it("should throw an Error", function() {
				var func = function() {
					var uuid_ = uuid();
					uuid_.remove("x");
				}

				expect(func).to.throw();
			});
		});

		context("with an uuid that has been added", function() {
			it("should remove the uuid", function() {
				var uuid_ = uuid();
				uuid_.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				expect(uuid_._uuids.length).to.equal(1);
				uuid_.remove("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				expect(uuid_._uuids.length).to.equal(0);
			});
		});
	});

	describe("#has", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					uuid().has();
				}

				expect(func).to.throw();
			});
		});

		context("with incorrect parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					uuid().has(1234);
				}

				expect(func).to.throw();
			});
		});

		context("with a non-existant uuid", function() {
			it("should throw an Error", function() {
				expect(uuid().has("x")).to.deep.equal(false);
			});
		});

		context("with a existant uuid", function() {
			it("should remove the uuid", function() {
				var uuid_ = uuid();
				uuid_.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				expect(uuid_.has("6ba7b810-9dad-41d1-80b4-00c04fd430c8")).to.deep.equal(true);
			});
		});
	});

	describe("#clear", function() {
		context("with no added uuids", function() {
			it("should still have 0 uuids", function() {
				var uuid_ = uuid();

				expect(uuid_._uuids.length).to.equal(0);

				uuid_.clear();
				expect(uuid_._uuids.length).to.equal(0);
			});
		});

		context("with one added uuid", function() {
			it("should now have 0 uuids", function() {
				var uuid_ = uuid();

				uuid_.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				expect(uuid_._uuids.length).to.equal(1);

				uuid_.clear();
				expect(uuid_._uuids.length).to.equal(0);
			});
		});

		context("with multiple added uuids", function() {
			it("should now have 0 uuids", function() {
				var uuid_ = uuid();

				uuid_.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				uuid_.add("6ba7b811-9dad-41d1-80b4-00c04fd430c8");
				expect(uuid_._uuids.length).to.equal(2);

				uuid_.clear();
				expect(uuid_._uuids.length).to.equal(0);
			});
		});
	});

	describe("#version", function() {
		context("with no parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					uuid().version();
				}

				expect(func).to.throw();
			});
		});

		context("with incorrect parameters", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					uuid().version(1234);
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect uuid", function() {
			it("should throw an Error", function() {
				var func = function() {
					uuid().version("x");
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect version number", function() {
			it("should throw an Error", function() {
				var func = function() {
					uuid().version("6ba7b810-9dad-61d1-80b4-00c04fd430c8");
				}

				expect(func).to.throw();
			});
		});

		context("with a correct uuid (v1)", function() {
			it("should return \"v1\"", function() {
				expect(uuid().version("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).to.equal("v1");
			});
		});

		context("with a correct uuid (v3)", function() {
			it("should return \"v3\"", function() {
				expect(uuid().version("6ba7b810-9dad-31d1-80b4-00c04fd430c8")).to.equal("v3");
			});
		});

		context("with a correct uuid (v4)", function() {
			it("should return \"v4\"", function() {
				expect(uuid().version("6ba7b810-9dad-41d1-80b4-00c04fd430c8")).to.equal("v4");
			});
		});

		context("with a correct uuid (v5)", function() {
			it("should return \"v5\"", function() {
				expect(uuid().version("6ba7b810-9dad-51d1-80b4-00c04fd430c8")).to.equal("v5");
			});
		});
	});

	describe("#check", function() {
		context("with no parameters", function() {
			it("should return false", function() {
				expect(uuid().check()).to.deep.equal(false);
			});
		});

		context("with incorrect parameters", function() {
			it("should return false", function() {
				expect(uuid().check(1234)).to.deep.equal(false);
			});
		});

		context("with an incorrect uuid", function() {
			it("should return false", function() {
				expect(uuid().check("x")).to.deep.equal(false);
			});
		});

		context("with a correct uuid but incorrect version", function() {
			it("should throw a TypeError", function() {
				var func = function() {
					uuid().check("6ba7b810-9dad-61d1-80b4-00c04fd430c8")
				}

				expect(func).to.throw();
			});
		});

		context("with the wrong type", function() {
			it("should return false", function() {
				expect(uuid().check("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).to.deep.equal(false);
			});
		});

		context("with a correct v1 uuid (and v1 type)", function() {
			it("should return true", function() {
				expect(uuid("v1").check("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).to.deep.equal(true);
			});
		});

		context("with a v4 uuid but an incorrect variant", function() {
			it("should return false", function() {
				expect(uuid("v1").check("6ba7b810-9dad-41d1-10b4-00c04fd430c8")).to.deep.equal(false);
			});
		});

		context("with a correct v4 uuid", function() {
			it("should return true", function() {
				expect(uuid().check("6ba7b810-9dad-41d1-80b4-00c04fd430c8")).to.deep.equal(true);
			});
		});
	});
});