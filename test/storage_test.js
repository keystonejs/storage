/* ========================================================================
 * StorageAPI: storage_test.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 16/08/2014
 * ========================================================================
 */

'use strict';

/* jshint expr:true */

var expect = require('chai').expect,
	stub = require('sinon').stub,
	spy = require('sinon').spy,
	mockery = require('mockery');

describe('Storage', function () {

	var Storage = require('../lib');

	describe('#init', function () {

		it('must correctly set up config variables', function () {
			Storage.init('config');
			expect(Storage.__config).to.equal('config');
		});

	});

	describe('#obtain', function () {

		beforeEach(function () {
			Storage.init();
			Storage.__providers = {};
		});

		it('should throw an error when no provider specified', function () {
			expect(Storage.obtain).to.throw(/forgot to specify/);
		});

		it('should throw an error when no config specified', function () {
			expect(function () {
				Storage.obtain('amazon');
			}).to.throw(/configuration found/);
		});

		it('should throw an error when provider is not supported', function () {
			Storage.init({});
			expect(function () {
				Storage.obtain('this.doesnt.exists');
			}).to.throw(/is not yet supported/);
		});

		it('should cache module instance instead of recreating', function () {
			var storageSpy = spy(require('../lib/storage'), 'call');
			stub(require('../lib/storage/amazon').prototype, '__ensureContainer').callsArgWith(0, null);

			Storage.init({
				key: '',
				keyId: '',
				container: ''
			});

			Storage.obtain('amazon');
			Storage.obtain('amazon');

			expect(storageSpy.calledOnce).to.be.true;

			storageSpy.restore();
		});

		it('should throw an error when provider does not extend StorageClient', function () {
			mockery.enable();
			mockery.registerMock('./storage/amazon', function () {});
			Storage.init({});
			expect(function () {
				Storage.obtain('amazon');
			}).to.throw(/not an instance of StorageClient/);
			mockery.disable();
		});

	});

	describe('#__exists', function () {

		it('should return false when module does not exists', function () {
			expect(Storage.__exists('this.doesnt.exists')).to.equal(false);
		});

		it('should return true when module is available', function () {
			expect(Storage.__exists('amazon')).to.equal(true);
		});

	});

});