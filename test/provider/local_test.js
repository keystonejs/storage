'use strict';

/* jshint expr:true */

var expect = require('chai').expect,
	Storage = require('../../lib'),
	rimraf = require('rimraf'),
	fs = require('fs');

describe('LocalSystem', function () {

	var container = 'local_tests',
		localStorage;

	before(function (done) {
		Storage
			.add('localStorage', {
				provider: Storage.Providers.LocalSystem,
				container: container
			})
			.get('localStorage', function (err, client) {
				localStorage = client;
				done();
			});
	});

	after(function (done) {
		rimraf(container, done);
	});

	describe('#_ensureContainer', function () {

		it('should create appropriate folder for a new instance', function (next) {
			fs.exists(container, function (exists) {
				expect(exists).to.be.true;
				next();
			});
		});

	});

	describe('#_upload', function () {

		it('should upload file to a root folder', function (next) {
			localStorage.upload('LICENSE', 'license', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should upload file to a nested folder', function (next) {
			localStorage.upload('LICENSE', 'nestedUpload/license', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should upload & overwrite file to existing nested folder', function (next) {
			localStorage.upload('LICENSE', 'nestedUpload/license', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should return valid callback', function (next) {
			localStorage.upload('LICENSE', 'nestedUpload/license2.md', function (err, callback) {
				expect(callback).to.have.property('container', container);
				expect(callback).to.have.property('path', 'nestedUpload');
				expect(callback).to.have.property('filename', 'license2.md');
				expect(callback).to.have.property('url', container + '/nestedUpload/license2.md');
				next();
			});
		});

		it('should raise an error when trying to upload directory', function (next) {
			localStorage.upload('test', 'nestedUpload/license.dir', function (err) {
				expect(err.message).to.match(/Can't upload entire directory/);
				next();
			});
		});

		it('should raise an error when uploading a file within another file', function (next) {
			localStorage.upload('LICENSE', 'nestedUpload/license/nested', function (err) {
				expect(err).to.match(/Can't ensure directory/);
				next();
			});
		});

		it('should raise an error when uploading a file as a directory', function (next) {
			localStorage.upload('LICENSE', 'nestedUpload', function (err) {
				expect(err).to.match(/There was a problem with uploading/);
				next();
			});
		});

	});

	describe('#_remove', function () {

		before(function (done) {
			localStorage.upload('LICENSE', 'nestedRemove/license', function (err) {
				done(err);
			});
		});

		it('should remove existing file', function (next) {
			localStorage.remove('nestedRemove/license', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should warn when file does not exists', function (next) {
			localStorage.remove('nestedRemove/license', function (err) {
				expect(err.message).to.match(/Can't remove non-existing/);
				next();
			});
		});

		it('should raise an error when trying to remove a directory', function (next) {
			localStorage.remove('nestedRemove', function (err) {
				expect(err.message).to.match(/Can't remove entire directory/);
				next();
			});
		});

	});

	describe('#_download', function () {

		before(function (done) {
			localStorage.upload('LICENSE', 'nestedDownload/LICENSE', function (err) {
				done(err);
			});
		});

		it('should download new file (without extension)', function (next) {
			localStorage.download('nestedDownload/LICENSE', container + '/downloaded', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should raise an error when downloading entire directory', function (next) {
			localStorage.download('nestedDownload', container + '/downloaded', function (err) {
				expect(err).to.match(/Can't download directory/);
				next();
			});
		});

		it('should return an error when downloading non-existing file', function (next) {
			localStorage.download('nestedDownload/README.md', container + '/readme', function (err) {
				expect(err).to.match(/Can't download non-existing/);
				next();
			});
		});

		it('should return an error when downloading to a wrong path', function (next) {
			localStorage.download('nestedDownload/LICENSE', container + '/nestedDownload/LICENSE/t', function (err) {
				expect(err).to.match(/There was a problem with downloading/);
				next();
			});
		});

	});

});