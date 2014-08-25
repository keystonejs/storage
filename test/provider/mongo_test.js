'use strict';

/* jshint expr:true */

var expect = require('chai').expect,
	Storage = require('../../lib'),
	rimraf = require('rimraf');

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

	});

	describe('#download', function () {

	});

	describe('#remove', function () {

	});

});