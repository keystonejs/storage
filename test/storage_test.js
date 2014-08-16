/* ========================================================================
 * StorageAPI: storage_test.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 16/08/2014
 * ========================================================================
 */

'use strict';

var expect = require('chai').expect;

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