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
	fs = require('fs'),
	path = require('path');

var MongoClient = function MongoClient(config) {

	this._ensureValid(['database'], config);

	config = _.defaults(config, {
		host: 'localhost',
		port: 27017,
		options: {
			safe: false
		}
	});

	var db = this._db = new mongo.Db(config.database, new mongo.Server(config.host, config.port, config.options));

	MongoClient.super_.call(this, config, gfs(db, mongo));

};

util.inherits(MongoClient, StorageClient);

MongoClient.prototype.upload = function (localSrc, destSrc, callback) {

	var writeStream = this._connection.createWriteStream({
			filename: destSrc
		}),
		container = this._config.database,
		destName = path.basename(destSrc);

	fs.createReadStream(localSrc).pipe(writeStream);

	writeStream.on('close', function () {
		callback(null, {
			container: container,
			path: destSrc,
			filename: destName,
			url: ''
		});
	});

	writeStream.on('error', function (err) {
		callback(err);
	});
};

MongoClient.prototype.download = function (destSrc, localSrc, callback) {

	var readStream = this._connection.createReadStream({
			filename: destSrc
		}),
		writeStream = fs.createWriteStream(localSrc);

	readStream.pipe(writeStream);

	readStream.on('error', callback);

	writeStream.on('close', function () {
		callback();
	});

};

MongoClient.prototype._init = function (callback) {
	this._db.open(callback);
};

module.exports = MongoClient;