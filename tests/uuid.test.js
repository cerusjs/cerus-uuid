const plugin = require("../index")();
const expect = require("chai").expect;
const uuid = plugin.uuid;

describe("uuid", () => {
	describe("constructor", () => {
		context("with no parameters", () => {
			it("shouldn't throw any errors", () => {
				const func = () => {
					uuid();
				}

				expect(func).to.not.throw();
			});
		});
		
		context("with a custom type", () => {
			it("shouldn't throw any errors", () => {
				const func = () => {
					uuid("v4");
				}

				expect(func).to.not.throw();
			});
		});
	});

	describe("#type", () => {
		context("with no parameters", () => {
			it("should return the default type", () => {
				const _uuid = uuid();

				expect(_uuid.type()).to.equal(_uuid._type);
			});
		});

		context("with incorrect parameters", () => {
			it("should return the default type", () => {
				const _uuid = uuid();

				expect(_uuid.type(1234)).to.equal(_uuid._type);
			});
		});

		context("with a string as parameters", () => {
			it("should now use the new type", () => {
				const _uuid = uuid();

				expect(_uuid.type()).to.equal(_uuid._type);
				_uuid.type("v3");
				expect(_uuid.type()).to.equal("v3");
			});
		});
	});

	describe("#generate", () => {
		context("with the v1 type", () => {
			it("should generate an uuid", () => {
				const _uuid = uuid("v1").generate();

				expect(_uuid).to.be.a("string");
			});
		});

		context("with the v3 type", () => {
			context("and no name", () => {
				it("should throw a TypeError", () => {
					const func = () => {
						uuid("v3").generate({namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
					}

					expect(func).to.throw();
				});
				
			});

			context("and no namespace", () => {
				it("should throw a TypeError", () => {
					const func = () => {
						uuid("v3").generate({name: "test"});
					}

					expect(func).to.throw();
				});
			});

			context("and the correct options", () => {
				it("should generate an uuid", () => {
					const _uuid = uuid("v3").generate({name: "test", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});

					expect(_uuid).to.be.a("string");
				});
			})
		});

		context("with the v4 type", () => {
			it("should generate an uuid", () => {
				const _uuid = uuid("v4").generate();

				expect(_uuid).to.be.a("string");
			});
		});

		context("with the v5 type", () => {
			context("and no name", () => {
				it("should throw a TypeError", () => {
					const func = () => {
						uuid("v5").generate({namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
					}

					expect(func).to.throw();
				});
				
			});

			context("and no namespace", () => {
				it("should throw a TypeError", () => {
					const func = () => {
						uuid("v5").generate({name: "test"});
					}

					expect(func).to.throw();
				});
			});

			context("and the correct options", () => {
				it("should generate an uuid", () => {
					const _uuid = uuid("v5").generate({name: "test", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});

					expect(_uuid).to.be.a("string");
				});
			})
		});

		context("causing a stack overflow by regenerating a fixed uuid", () => {
			it("should throw an Error", () => {
				const func = () => {
					const _uuid = uuid("v5");

					_uuid.generate({name: "test", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
					_uuid.generate({name: "test", namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"});
				}
				
				expect(func).to.throw();
			});
		});
	});

	describe("#add", () => {
		context("with an incorrect uuid (format)", () => {
			it("should throw an Error", () => {
				const func = () => {
					uuid().add("abcd-efgh-ijkl-mnop");
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect uuid (version)", () => {
			it("should throw an Error", () => {
				const func = () => {
					uuid().add("6ba7b810-9dad-11d1-80b4-00c04fd430c8");
				}

				expect(func).to.throw();
			});
		});

		context("with a correct uuid", () => {
			it("should add the uuid", () => {
				const _uuid = uuid();

				_uuid.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");

				expect(_uuid._uuids.length).to.equal(1);
			});
		});

		context("with an already added uuid", () => {
			it("should throw an Error", () => {
				const func = () => {
					const _uuid = uuid();

					_uuid.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
					_uuid.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				}

				expect(func).to.throw();
			});
		});
	});

	describe("#remove", () => {
		context("with an uuid that hasn't been added", () => {
			it("should throw an Error", () => {
				const func = () => {
					const _uuid = uuid();

					_uuid.remove("x");
				}

				expect(func).to.throw();
			});
		});

		context("with an uuid that has been added", () => {
			it("should remove the uuid", () => {
				const _uuid = uuid();

				_uuid.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				expect(_uuid._uuids.length).to.equal(1);
				_uuid.remove("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				expect(_uuid._uuids.length).to.equal(0);
			});
		});
	});

	describe("#has", () => {
		context("with a non-existant uuid", () => {
			it("should throw an Error", () => {
				expect(uuid().has("x")).to.deep.equal(false);
			});
		});

		context("with a existant uuid", () => {
			it("should remove the uuid", () => {
				const _uuid = uuid();

				_uuid.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				expect(_uuid.has("6ba7b810-9dad-41d1-80b4-00c04fd430c8")).to.deep.equal(true);
			});
		});
	});

	describe("#clear", () => {
		context("with no added uuids", () => {
			it("should still have 0 uuids", () => {
				const _uuid = uuid();

				expect(_uuid._uuids.length).to.equal(0);
				_uuid.clear();
				expect(_uuid._uuids.length).to.equal(0);
			});
		});

		context("with one added uuid", () => {
			it("should now have 0 uuids", () => {
				const _uuid = uuid();

				_uuid.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				expect(_uuid._uuids.length).to.equal(1);
				_uuid.clear();
				expect(_uuid._uuids.length).to.equal(0);
			});
		});

		context("with multiple added uuids", () => {
			it("should now have 0 uuids", () => {
				const _uuid = uuid();

				_uuid.add("6ba7b810-9dad-41d1-80b4-00c04fd430c8");
				_uuid.add("6ba7b811-9dad-41d1-80b4-00c04fd430c8");
				expect(_uuid._uuids.length).to.equal(2);
				_uuid.clear();
				expect(_uuid._uuids.length).to.equal(0);
			});
		});
	});

	describe("#version", () => {
		context("with an incorrect uuid", () => {
			it("should throw an Error", () => {
				const func = () => {
					uuid().version("x");
				}

				expect(func).to.throw();
			});
		});

		context("with an incorrect version number", () => {
			it("should throw an Error", () => {
				const func = () => {
					uuid().version("6ba7b810-9dad-61d1-80b4-00c04fd430c8");
				}

				expect(func).to.throw();
			});
		});

		context("with a correct uuid (v1)", () => {
			it("should return \"v1\"", () => {
				expect(uuid().version("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).to.equal("v1");
			});
		});

		context("with a correct uuid (v3)", () => {
			it("should return \"v3\"", () => {
				expect(uuid().version("6ba7b810-9dad-31d1-80b4-00c04fd430c8")).to.equal("v3");
			});
		});

		context("with a correct uuid (v4)", () => {
			it("should return \"v4\"", () => {
				expect(uuid().version("6ba7b810-9dad-41d1-80b4-00c04fd430c8")).to.equal("v4");
			});
		});

		context("with a correct uuid (v5)", () => {
			it("should return \"v5\"", () => {
				expect(uuid().version("6ba7b810-9dad-51d1-80b4-00c04fd430c8")).to.equal("v5");
			});
		});
	});

	describe("#check", () => {
		context("with no parameters", () => {
			it("should return false", () => {
				expect(uuid().check()).to.deep.equal(false);
			});
		});

		context("with incorrect parameters", () => {
			it("should return false", () => {
				expect(uuid().check(1234)).to.deep.equal(false);
			});
		});

		context("with an incorrect uuid", () => {
			it("should return false", () => {
				expect(uuid().check("x")).to.deep.equal(false);
			});
		});

		context("with a correct uuid but incorrect version", () => {
			it("should throw a TypeError", () => {
				const func = () => {
					uuid().check("6ba7b810-9dad-61d1-80b4-00c04fd430c8")
				}

				expect(func).to.throw();
			});
		});

		context("with the wrong type", () => {
			it("should return false", () => {
				expect(uuid().check("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).to.deep.equal(false);
			});
		});

		context("with a correct v1 uuid (and v1 type)", () => {
			it("should return true", () => {
				expect(uuid("v1").check("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).to.deep.equal(true);
			});
		});

		context("with a v4 uuid but an incorrect variant", () => {
			it("should return false", () => {
				expect(uuid("v1").check("6ba7b810-9dad-41d1-10b4-00c04fd430c8")).to.deep.equal(false);
			});
		});

		context("with a correct v4 uuid", () => {
			it("should return true", () => {
				expect(uuid().check("6ba7b810-9dad-41d1-80b4-00c04fd430c8")).to.deep.equal(true);
			});
		});
	});
});