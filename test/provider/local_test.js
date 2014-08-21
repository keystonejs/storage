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
			Storage.get('localStorage').upload('LICENSE', 'license.md', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should upload file to a nested folder', function (next) {
			Storage.get('localStorage').upload('LICENSE', 'nested/nested2/license.md', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should upload & overwrite file to existing nested folder', function (next) {
			Storage.get('localStorage').upload('LICENSE', 'nested/nested2/license.md', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should return valid callback', function (next) {
			Storage.get('localStorage').upload('LICENSE', 'nested/nested2/license.md', function (err, callback) {
				expect(callback).to.have.property('container', container);
				expect(callback).to.have.property('path', 'nested/nested2');
				expect(callback).to.have.property('filename', 'license.md');
				expect(callback).to.have.property('url', container + '/nested/nested2/license.md');
				next();
			});
		});

		it('should raise an error when trying to upload directory', function (next) {
			Storage.get('localStorage').upload('test', 'nested/nested2', function (err) {
				expect(err.message).to.match(/Can't upload entire directory/);
				next();
			});
		});

		it('should raise an error when trying to upload file as a directory', function (next) {
			Storage.get('localStorage').upload('LICENSE', 'nested/nested2', function (err) {
				expect(err.message).to.match(/Can't upload as a directory/);
				next();
			});
		});

	});

	describe('#__remove', function () {

		it('should remove existing file', function (next) {
			Storage.get('localStorage').remove('nested/nested2/license.md', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should warn when file does not exists', function (next) {
			Storage.get('localStorage').remove('nested/nested2/license.md', function (err) {
				expect(err).to.have.property('code', 'ENOENT');
				next();
			});
		});

		it('should raise an error when trying to remove a directory', function (next) {
			Storage.get('localStorage').remove('nested/nested2', function (err) {
				expect(err.message).to.match(/No file/);
				next();
			});
		});

	});

	describe('#__download', function () {

	});

});