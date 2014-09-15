/**
 * @fileOverview MongoDB integration
 * @author Mike Grabowski (@grabbou)
 * @version 0.2
 */

'use strict';

var util = require('util'),
	StorageClient = require('../client'),
	_ = require('underscore'),
	mongo = require('mongodb'),
	gfs = require('gridfs-stream'),
	fs = require('fs'),
	path = require('path');

/**
 * Creates new MongoClient instance
 * @class
 * @classdesc MongoClient integration for storing files inside a database using GridFS
 * Explanation:
 * - `container` - database name
 * - `path` - path to the file relative to the `container`
 * - `filename` - name of the file extracted from `path`
 * - `url` - blank, no web access by default
 * @augments StorageClient
 * @param {Object} config
 */
var MongoClient = function MongoClient(config) {

	this._ensureValid(['database'], config);

	config = _.defaults(config, {
		host: 'localhost',
		port: 27017,
		options: {
			safe: true
		}
	});

	var db = this._db = new mongo.Db(config.database, new mongo.Server(config.host, config.port), config.options);

	MongoClient.super_.call(this, config, gfs(db, mongo));

};

util.inherits(MongoClient, StorageClient);

MongoClient.prototype.upload = function (localSrc, destSrc, callback) {

	var writeStream = this._connection.createWriteStream({
			filename: destSrc
		}),
		readStream = fs.createReadStream(localSrc),
		container = this._config.database,
		fileName = path.basename(destSrc);

	readStream.pipe(writeStream);

	writeStream.on('close', function () {
		callback(null, {
			container: container,
			path: destSrc,
			filename: fileName,
			url: ''
		});
	});

	writeStream.on('error', function (err) {
		if (err) err.message = 'MongoClient: Error while uploading ' + destSrc + '. Details: ' + err.message;
		callback(err);
	});

	readStream.on('error', function (err) {
		if (err) err.message = 'MongoClient: Can\'t start uploading ' + localSrc + '. Details: ' + err.message;
		callback(err);
	});
};

MongoClient.prototype.download = function (destSrc, localSrc, callback) {

	var readStream = this._connection.createReadStream({
			filename: destSrc
		}),
		writeStream = fs.createWriteStream(localSrc);

	readStream.pipe(writeStream);

	readStream.on('error', function (err) {
		if (err) err.message = 'MongoClient: Error while downloading ' + destSrc + '. Details: ' + err.message;
		callback(err);
	});

	writeStream.on('error', function (err) {
		if (err) err.message = 'MongoClient: Error writing to ' + localSrc + '. Details: ' + err.message;
		callback(err);
	});

	writeStream.on('close', function () {
		callback();
	});

};

MongoClient.prototype.remove = function (destSrc, callback) {

	this._connection.remove({
		filename: destSrc
	}, function (err) {
		if (err) err.message = 'MongoClient: Error while removing ' + destSrc + '. Details: ' + err.message;
		callback(err);
	});

};

MongoClient.prototype._init = function (callback) {

	// Instead of reconnecting, we use existing connection
	if (!this._db.openCalled) {
		this._db.open(function (err) {
			if (err) err.message = 'MongoClient: There was a problem with initialization. Details: ' + err.message;
			callback(err);
		});
	} else {
		callback();
	}

};

MongoClient.prototype._exit = function (callback) {
	this._db.close(callback);
};

module.exports = MongoClient;