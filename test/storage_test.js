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
		_init = stub(Storage.Providers.AmazonS3.prototype, '_init').callsArgWith(0, null),
		_cachedInstance = spy(Storage.Providers, 'AmazonS3');

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

	describe('#init', function () {

		it('must set up variables correctly', function () {
			expect(Storage._config).to.have.property('amazon');
		});

	});

	describe('#add', function () {

		it('must set up variables correctly', function () {
			Storage.add('custom', '');
			expect(Storage._config).to.have.property('custom');
		});

	});

	describe('#_getInstance', function () {

		it('should throw an error if instance is missing a config', function () {
			delete Storage._config.amazon;
			expect(function () {
				Storage._getInstance('amazon');
			}).to.throw(/Configuration for amazon is missing/);
		});

		it('should throw an error if no provider set for an instance', function () {
			delete Storage._config.amazon.provider;
			expect(function () {
				Storage._getInstance('amazon');
			}).to.throw(/Provider for amazon is not specified/);
		});

		it('should cache instances', function () {
			Storage._getInstance('amazon');
			Storage._getInstance('amazon');
			expect(_cachedInstance.calledOnce).to.be.true;
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