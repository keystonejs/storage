/* ========================================================================
 * StorageAPI: local.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 20/08/2014
 * ========================================================================
 */

'use strict';

var util = require('util'),
	fs = require('fs'),
	copy = require('ncp').ncp,
	path = require('path'),
	StorageClient = require('./');

var LocalClient = function LocalClient(config) {

	this.__ensureValid(['path'], config);

	LocalClient.super_.call(this, config);

};

util.inherits(LocalClient, StorageClient);

/**
 * {@inheritDoc}
 */
LocalClient.prototype.__ensureContainer = function (callback) {
	fs.mkdir(this.__config.path, function (err) {
		if (err && err.errno !== 47) {
			callback(err);
		} else {
			callback();
		}
	});
};

/**
 * {@inheritDoc}
 */
LocalClient.prototype.upload = function (fileSrc, fileName, callback) {
	fs.rename(fileSrc, path.join(this.__config.path, fileName), function (err) {
		callback(err);
	});
};

/**
 * {@inheritDoc}
 */
LocalClient.prototype.remove = function (filename, callback) {
	fs.unlink(path.join(this.__config.path, filename), function (err) {
		callback(err);
	});
};

/**
 * {@inheritDoc}
 */
LocalClient.prototype.download = function (filename, fileSrc, callback) {
	copy(path.join(this.__config.path, filename), fileSrc, function (err) {
		callback(err);
	});
};

module.exports = LocalClient;