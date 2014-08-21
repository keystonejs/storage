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

	beforeEach(function () {
		Storage.init({});
		Storage._cache = {};
	});

	describe('#init', function () {

		it('it must set up correctly variables', function () {
			Storage.init('config');
			expect(Storage._config).to.equal('config');
		});

		it('should return this to allow method chaining', function () {
			expect(Storage.init('config')).to.equal(Storage);
		});

	});

	describe('#add', function () {

		it('it must set up correctly variables', function () {
			Storage.add('amazon', 'config');
			expect(Storage._config.amazon).to.equal('config');
		});

		it('should return this to allow method chaining', function () {
			expect(Storage.add('amazon', '')).to.equal(Storage);
		});

	});

	describe('#get', function () {

		it('should throw an error when no instance specified', function () {
			expect(Storage.get).to.throw(/forgot to specify instance/);
		});

		it('should throw an error when no config specified for an instance', function () {
			expect(function () {
				Storage.get('amazon');
			}).to.throw(/you forgot to declare it/);
		});

		it('should throw an error when no provider specified for an instance', function () {
			Storage.init({
				amazon: {}
			});
			expect(function () {
				Storage.get('amazon');
			}).to.throw(/is not specified/);
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

	describe('#_cache', function () {

		it('should cache module instance instead of recreating', function () {
			var constructor = spy(Storage.Providers, 'AmazonS3');
			stub(Storage.Providers.AmazonS3.prototype, '_ensureContainer').callsArgWith(0, null);

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

			expect(constructor.calledOnce).to.be.true;
		});

	});

});