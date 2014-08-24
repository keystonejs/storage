/* ========================================================================
 * StorageAPI: mongodb.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 24/08/2014
 * ========================================================================
 */

'use strict';

var util = require('util'),
	StorageClient = require('../client'),
	_ = require('underscore'),
	mongo = require('mongodb'),
	gfs = require('gridfs-stream'),
	fs = require('fs');

var MongoClient = function MongoClient(config, callback) {

	this._ensureValid(['database', 'collection'], config);

	config = _.defaults(config, {
		host: 'localhost',
		port: 27017,
		options: {
			safe: false
		}
	});

	var db = this._db = new mongo.Db(config.database, new mongo.Server(config.host, config.port, config.options));

	MongoClient.super_.call(this, config, gfs(db, mongo), callback);

};

util.inherits(MongoClient, StorageClient);

MongoClient.prototype.upload = function (localSrc, destSrc, callback) {

	var writeStream = this._connection.createWriteStream({
		filename: destSrc
	});

	fs.createReadStream(localSrc).pipe(writeStream);

	writeStream.on('close', function (file) {
		callback(null, file);
	});

	writeStream.on('error', function (err) {
		callback(err);
	});
};

// @TODO implement db check
MongoClient.prototype._ensureContainer = function (callback) {
	callback();
};

module.exports = MongoClient;