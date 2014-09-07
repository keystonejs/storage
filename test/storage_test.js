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
		_emptyCallback = function () {},
		_init = stub(Storage.Providers.AmazonS3.prototype, '_init').callsArgWith(0, null),
		_cachedInstance = spy(Storage.Providers, 'AmazonS3');

	stub(Storage.Providers.AmazonS3.prototype, 'upload').callsArgWith(2, null);

	beforeEach(function () {
		Storage.init({
			amazon: {
				provider: Storage.Providers.AmazonS3,
				key: '',
				keyId: '',
				container: ''
			}
		});
		Storage._cache = {};
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
			Storage.get('amazon', _emptyCallback);
			Storage.get('amazon', _emptyCallback);
			expect(_init.calledTwice).to.be.true;
		});

		it('should assign default instance if null', function (next) {
			Storage.settings('default instance', 'amazon');
			Storage.get(function (err, client) {
				expect(client).to.be.an.instanceof(Storage.Providers.AmazonS3);
				next();
			});
		});

		it('should throw an error if no default instance specified', function (next) {
			delete Storage._settings['default instance'];
			expect(function () {
				Storage.get(function () {});
			}).to.throw(/No default provider/);
			next();
		});

	});

	describe('#pre', function () {

		it('should set local hook', function (next) {
			Storage
				.pre('amazon', 'upload', function (done) {
					done(new Error('Local Hook'));
				})
				.get('amazon', function (err, client) {
					client.upload('file1.txt', 'file2.txt', function (err) {
						expect(err.message).to.match(/Local Hook/);
						next();
					});
				});
		});

		it('should set global hook', function (next) {
			Storage
				.pre('upload', function (done) {
					done(new Error('Global Hook'));
				})
				.get('amazon', function (err, client) {
					client.upload('file1.txt', 'file2.txt', function (err) {
						expect(err.message).to.match(/Global Hook/);
						next();
					});
				});
		});

	});

	describe('#post', function () {

		it('should set local hook', function (next) {
			Storage
				.post('amazon', 'upload', function (done) {
					done(new Error('Local Hook'));
				})
				.get('amazon', function (err, client) {
					client.upload('file1.txt', 'file2.txt', function (err) {
						expect(err.message).to.match(/Local Hook/);
						next();
					});
				});
		});

		it('should set global hook', function (next) {
			Storage
				.post('upload', function (done) {
					done(new Error('Global Hook'));
				})
				.get('amazon', function (err, client) {
					client.upload('file1.txt', 'file2.txt', function (err) {
						expect(err.message).to.match(/Global Hook/);
						next();
					});
				});
		});

	});

	describe('#exit', function () {

		it('should exit gracefully by calling _exit on every instance', function (next) {

			Storage._getInstance('amazon');

			var exitMethod = spy(Storage._cache.amazon, '_exit');

			Storage.exit(function () {
				expect(exitMethod.calledOnce).to.be.true;
				next();
			});

		});

	});

});