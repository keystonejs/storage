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

	var Storage = require('../lib'),
		_init = stub(Storage.Providers.AmazonS3.prototype, '_init').callsArgWith(0, null);

	beforeEach(function () {
		Storage.init({});
		Storage._cache = {};
	});

	describe('#init', function () {

		it('must set up variables correctly', function () {
			Storage.init('config');
			expect(Storage._config).to.equal('config');
		});

		it('should return {Storage} to allow method chaining', function () {
			expect(Storage.init('config')).to.equal(Storage);
		});

	});

	describe('#add', function () {

		it('must set up variables correctly', function () {
			Storage.add('amazon', 'config');
			expect(Storage._config.amazon).to.equal('config');
		});

		it('should return {Storage} to allow method chaining', function () {
			expect(Storage.add('amazon', '')).to.equal(Storage);
		});

	});

	describe('#_getInstance', function () {

		it('should throw an error if instance is missing a config', function () {
			expect(function () {
				Storage.get('amazon');
			}).to.throw(/Configuration for amazon is missing/);
		});

		it('should throw an error if no provider set for an instance', function () {
			Storage.init({
				amazon: {}
			});

			expect(function () {
				Storage.get('amazon');
			}).to.throw(/Provider for amazon is not specified/);
		});

		it('should cache instances', function () {
			var constructor = spy(Storage.Providers, 'AmazonS3');

			Storage.init({
				amazon: {
					provider: Storage.Providers.AmazonS3,
					key: '',
					keyId: '',
					container: ''
				}
			});

			Storage._getInstance('amazon');
			Storage._getInstance('amazon');

			expect(constructor.calledOnce).to.be.true;
		});

	});

	describe('', function () {

		beforeEach(function () {
			Storage.init({
				amazon: {
					provider: Storage.Providers.AmazonS3,
					key: '',
					keyId: '',
					container: ''
				}
			});
		});

		describe('#get', function () {

			it('should call _init on every get', function () {
				Storage.get('amazon', function () {});
				Storage.get('amazon', function () {});
				expect(_init.calledTwice).to.be.true;
			});

			it.skip('should assign default instance if null', function (next) {
				Storage.get(function (err, client) {
					expect(client).to.be.an.instanceof(Storage.Providers.AmazonS3);
					next();
				});
			});

		});

		describe('#pre', function () {

			it.skip('should set local hook', function () {

			});

			it.skip('should set global hook', function () {

			});

		});

		describe('#post', function () {

			it.skip('should set local hook', function () {

			});

			it.skip('should set global hook', function () {

			});

		});

	});


});