/* ========================================================================
 * StorageAPI: storage_client_test.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 17/08/2014
 * ========================================================================
 */

'use strict';

var expect = require('chai').expect,
	inherits = require('util').inherits;

describe('StorageClient', function () {

	var StorageClient = require('../lib/storage');

	describe('#constructor', function () {

		it('should disallow to create an abstract instance', function () {

			expect(function () {
				new StorageClient({}, {});
			}).to.throw(/Cannot initialize/);

		});

	});

	describe('#interface', function () {

		var TestObject = function TestObject () {},
			testObject;

		inherits(TestObject, StorageClient);

		beforeEach(function () {
			testObject = new TestObject();
		});

		it('should throw error when invoking abstract methods', function () {

			var TestObject = function TestObject () {};
			inherits(TestObject, StorageClient);

			expect(testObject.upload).to.throw(/Cannot invoke/);
			expect(testObject.remove).to.throw(/Cannot invoke/);
			expect(testObject.download).to.throw(/Cannot invoke/);
			expect(testObject.__ensureContainer).to.throw(/Cannot invoke/);

		});

		it('should allow to use common StorageClient methods', function () {
			expect(testObject.__ensureValid).not.to.throw(/Cannot invoke/);
		});

	});

});