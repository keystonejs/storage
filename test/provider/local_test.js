/* ========================================================================
 * StorageAPI: local_test.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 21/08/2014
 * ========================================================================
 */

'use strict';

/* jshint expr:true */

var expect = require('chai').expect,
	Storage = require('../../lib'),
	rimraf = require('rimraf'),
	fs = require('fs');

describe('LocalSystem', function () {

	var container = 'local_tests';

	Storage
		.add('localStorage', {
			provider: Storage.Providers.LocalSystem,
			container: container
		})
		.get('localStorage');

	after(function (done) {
		rimraf(container, done);
	});

	describe('#__ensureContainer', function () {

		it('should create appropriate folder for a new instance', function (next) {
			fs.exists(container, function (exists) {
				expect(exists).to.be.true;
				next();
			});
		});

	});

	describe('#__upload', function () {

		it('should upload file to a root folder', function (next) {
			Storage.get('localStorage').upload('LICENSE', 'license', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should upload file to a nested folder', function (next) {
			Storage.get('localStorage').upload('LICENSE', 'nested/nested2/license', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should upload & overwrite file to existing nested folder', function (next) {
			Storage.get('localStorage').upload('LICENSE', 'nested/nested2/license', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should return valid callback', function (next) {
			Storage.get('localStorage').upload('LICENSE', 'nested/nested2/license2.md', function (err, callback) {
				expect(callback).to.have.property('container', container);
				expect(callback).to.have.property('path', 'nested/nested2');
				expect(callback).to.have.property('filename', 'license2.md');
				expect(callback).to.have.property('url', container + '/nested/nested2/license2.md');
				next();
			});
		});

		it('should raise an error when trying to upload directory', function (next) {
			Storage.get('localStorage').upload('test', 'nested/nested2', function (err) {
				expect(err.message).to.match(/Can't upload entire directory/);
				next();
			});
		});

		it('should raise an error when uploading a file within another file', function (next) {
			Storage.get('localStorage').upload('LICENSE', 'nested/nested2/license/nested', function (err) {
				expect(err).to.have.property('code', 'ENOTDIR');
				next();
			});
		});

	});

	describe('#__remove', function () {

		before(function (next) {
			Storage.get('localStorage').upload('LICENSE', 'nested/nested2/license', function () {
				next();
			});
		});

		it('should remove existing file', function (next) {
			Storage.get('localStorage').remove('nested/nested2/license', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should warn when file does not exists', function (next) {
			Storage.get('localStorage').remove('nested/nested2/license', function (err) {
				expect(err.message).to.match(/Can't remove non-existing/);
				next();
			});
		});

		it('should raise an error when trying to remove a directory', function (next) {
			Storage.get('localStorage').remove('nested/nested2', function (err) {
				expect(err.message).to.match(/Can't remove entire directory/);
				next();
			});
		});

	});

	describe('#__download', function () {

		it('should download new file', function (next) {
			Storage.get('localStorage').download('nested/nested2/license2.md', container + '/license.md', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should raise an error when downloading directory', function (next) {
			Storage.get('localStorage').download('nested', container + '/license.md', function (err) {
				expect(err).to.match(/Can't download directory/);
				next();
			});
		});

		it.skip('should allow to download a file without an extension', function (next) {

		});

	});

});