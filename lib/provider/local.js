/* ========================================================================
 * StorageAPI: local.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 20/08/2014
 * ========================================================================
 * Terminology:
 * - container - name of the root folder
 * - path - full file path relative to container
 * - url - full path to a file (with container & path)
 * ========================================================================
 */

'use strict';

var util = require('util'),
	StorageClient = require('../client'),
	waterfall = require('async').waterfall,
	path = require('path'),

	// filesystem methods
	unlink = require('fs').unlink,
	mkdir = require('fs').mkdir,
	mkdirp = require('mkdirp'),
	copy = require('ncp').ncp;

var LocalClient = function LocalClient(config) {

	this.__ensureValid(['path'], config);

	LocalClient.super_.call(this, config);

};

util.inherits(LocalClient, StorageClient);

/**
 * {@inheritDoc}
 */
LocalClient.prototype.__ensureContainer = function (callback) {
	mkdir(this.__config.path, function (err) {
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
LocalClient.prototype.upload = function (fileSrc, fileDest, callback) {

	var container = this.__config.path,
		filePath = path.dirname(fileDest),
		fileName = path.basename(fileDest);

	// before saving, let's ensure that all of the path folders exist (recursively)
	waterfall([
		function (callback) {
			mkdirp(path.join(container, filePath), function (err) {
				if (err && err.errno !== 47) {
					callback(err);
				} else {
					callback();
				}
			});
		},
		function (callback) {
			copy(fileSrc, path.join(container, fileDest), function (err) {
				if (err) {
					callback(err);
				} else {
					callback(null, {
						container: container,
						path: filePath,
						filename: fileName,
						url: path.join(container, fileDest)
					});
				}
			});
		}
	], callback);

};

/**
 * {@inheritDoc}
 */
LocalClient.prototype.remove = function (filename, callback) {
	unlink(path.join(this.__config.path, filename), function (err) {
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