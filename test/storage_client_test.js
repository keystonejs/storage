/* ========================================================================
 * StorageAPI: storage_client_test.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 17/08/2014
 * ========================================================================
 */

'use strict';

var expect = require('chai').expect,
	inherits = require('util').inherits,
	stub = require('sinon').stub;

describe('StorageClient', function () {

	var StorageClient = require('../lib/provider/client');

	describe('#constructor', function () {

		it('should disallow to create an abstract instance', function () {

			expect(function () {
				new StorageClient({}, {});
			}).to.throw(/Cannot initialize/);

		});

	});

	describe('#interface', function () {

		var TestObject = function TestObject() {},
			testObject;

		inherits(TestObject, StorageClient);

		beforeEach(function () {
			testObject = new TestObject();
		});

		describe('#abstract methods', function () {

			it('should throw error when invoking abstract methods', function () {
				expect(testObject.upload).to.throw(/Cannot invoke/);
				expect(testObject.remove).to.throw(/Cannot invoke/);
				expect(testObject.download).to.throw(/Cannot invoke/);
				expect(testObject.__ensureContainer).to.throw(/Cannot invoke/);

			});

			it('should allow to use common StorageClient methods', function () {
				expect(testObject.__ensureValid).not.to.throw(/Cannot invoke/);
			});

		});

		describe('#__isValid', function () {

			it('should throw an error if given schema is invalid', function () {
				expect(function () {
					testObject.__ensureValid(['key', 'keyId'], {key: 'someValue'});
				}).to.throw(/Missing argument for keyId/);
			});

			it('should handle non-array arguments', function () {
				expect(function () {
					testObject.__ensureValid('key', {key: 'someValue'});
				}).to.not.throw(TypeError);
			});

		});



	});

	describe('#inheritance', function () {

		var TestObject = function TestObject(config, connection) {
			TestObject.super_.call(this, config, connection);
		};

		inherits(TestObject, StorageClient);

		var ensureStub = stub(TestObject.prototype, '__ensureContainer').callsArgWith(0, null);

		it('should assign arguments to local properties by calling parent constructor', function () {
			var testObject = new TestObject({someValue: ''}, {someValue: ''});
			expect(testObject).to.have.deep.property('__config.someValue');
			expect(testObject).to.have.deep.property('__connection.someValue');
		});

		it('should throw an error if unable to ensure container', function () {
			ensureStub.callsArgWith(0, new Error());
			expect(function () {
				new TestObject();
			}).to.throw(/There was a problem/);
		});

	});

});