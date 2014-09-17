'use strict';

/* jshint expr:true */

var expect = require('chai').expect,
	Storage = require('../../lib'),
	rimraf = require('rimraf'),
	fs = require('fs');

describe('MongoClient', function () {

	var database = 'test_db',
		dbClient;

	before(function (done) {
		Storage.add('database', {
			provider: Storage.Providers.MongoDB,
			database: database
		});
		Storage.add('broken', {
			provider: Storage.Providers.MongoDB,
			database: database,
			port: 3000
		});
		Storage.get('database', function (err, client) {
			dbClient = client;
			done();
		});
		fs.mkdirSync(database);
	});

	after(function (done) {
		rimraf(database, done);
	});

	describe('#_init', function () {

		it('should handle open connections and use them instead of creating', function (next) {
			Storage.get('database', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

		it('should raise an error when database is unavailable', function (next) {
			Storage.get('broken', function (err) {
				expect(err.message).to.match(/problem with initialization/);
				next();
			});
		});

	});

	describe('#upload', function () {

		it('should upload file and return appropriate callback', function (next) {
			dbClient.upload('LICENSE', 'nestedUpload/license2.md', function (err, callback) {
				expect(callback).to.have.property('container', database);
				expect(callback).to.have.property('path', 'nestedUpload/license2.md');
				expect(callback).to.have.property('filename', 'license2.md');
				expect(callback).to.have.property('url', '');
				next();
			});
		});

	});

	describe('#download', function () {

		before(function (done) {
			dbClient.upload('LICENSE', 'nestedUpload/license2.md', function (err) {
				done(err);
			});
		});

		it('should download file from database and save it', function (next) {
			dbClient.download('nestedUpload/license2.md', database + '/license.md', function (err) {
				expect(err).to.be.undefined;
				next();
			});
		});

	});

	describe('#remove', function () {

		before(function (done) {
			dbClient.upload('LICENSE', 'nestedUpload/license2.md', function (err) {
				done(err);
			});
		});

		it('should remove file from database', function (next) {
			dbClient.remove('nestedUpload/license2.md', function (err) {
				expect(err).to.be.null;
				next();
			});
		});

	});

});