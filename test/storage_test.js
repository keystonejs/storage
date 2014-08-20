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
	spy = require('sinon').spy;

describe('Storage', function () {

	var Storage = require('../lib');

	describe('#init', function () {

		it('must correctly set up config variables', function () {
			Storage.init('config');
			expect(Storage._config).to.equal('config');
		});

	});

	describe('#get', function () {

		beforeEach(function () {
			Storage.init({});
			Storage._cache = {};
		});

		it('should throw an error when no provider specified', function () {
			expect(Storage.get).to.throw(/forgot to specify/);
		});

		it('should throw an error when no config specified', function () {
			expect(function () {
				Storage.get('amazon');
			}).to.throw(/you forgot to declare it/);
		});

		it('should cache module instance instead of recreating', function () {
			var storageSpy = spy(require('../lib/storage'), 'call');
			stub(require('../lib/storage/amazon').prototype, '__ensureContainer').callsArgWith(0, null);

			Storage.init({
				amazon: {
					provider: Storage.Providers.AmazonS3,
					key: '',
					keyId: '',
					container: ''
				}
			});

			Storage.get('amazon');
			Storage.get('amazon');

			expect(storageSpy.calledOnce).to.be.true;

			storageSpy.restore();
		});

		it('should throw an error when provider does not extend StorageClient', function () {
			Storage.init({
				amazon: {
					provider: function () {},
					key: '',
					keyId: '',
					container: ''
				}
			});
			expect(function () {
				Storage.get('amazon');
			}).to.throw(/not an instance of StorageClient/);
		});

	});

})
;