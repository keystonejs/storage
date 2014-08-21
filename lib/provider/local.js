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
	exists = require('fs').exists,
	mkdirp = require('mkdirp'),
	copy = require('ncp').ncp,
	stat = require('fs').stat;

var LocalClient = function LocalClient(config) {

	this.__ensureValid(['container'], config);

	LocalClient.super_.call(this, config);

};

util.inherits(LocalClient, StorageClient);

/**
 * {@inheritDoc}
 */
LocalClient.prototype.__ensureContainer = function (callback) {
	mkdirp(this.__config.container, callback);
};

/**
 * {@inheritDoc}
 */
LocalClient.prototype.upload = function (localSrc, destSrc, callback) {

	var container = this.__config.container,
		destPath = path.dirname(destSrc),
		destName = path.basename(destSrc);

	// before saving, let's ensure that all of the path folders exist (recursively)
	waterfall([
		function (callback) {
			stat(localSrc, function (err, stat) {
				var error = err || stat.isDirectory() ? new Error('LocalSystem: Can\'t upload entire directory') : null;
				callback(error);
			});
		},
		function (callback) {
			mkdirp(path.join(container, destPath), function (err) {
				callback(err);
			});
		},
		function (callback) {
			copy(localSrc, path.join(container, destSrc), function (err) {
				if (err) {
					// possible bug in copy library returning array instead of single error
					err = err[0] || err;
					callback(err);
				} else {
					callback(null, {
						container: container,
						path: destPath,
						filename: destName,
						url: path.join(container, destSrc)
					});
				}
			});
		}
	], callback);

};

/**
 * {@inheritDoc}
 */
LocalClient.prototype.remove = function (destSrc, callback) {

	destSrc = path.join(this.__config.container, destSrc);

	waterfall([
		function (callback) {
			exists(destSrc, function (exists) {
				var error = !exists ? new Error('LocalSystem: Can\'t remove non-existing file') : null;
				callback(error);
			});
		},
		function (callback) {
			stat(destSrc, function (err, stat) {
				var error = err || stat.isDirectory() ? new Error('LocalSystem: Can\'t remove entire directory') : null;
				callback(error);
			});
		},
		function (callback) {
			unlink(destSrc, function (err) {
				callback(err);
			});
		}
	], callback);
};

/**
 * {@inheritDoc}
 */
LocalClient.prototype.download = function (destSrc, localSrc, callback) {
	if (path.extname(destSrc)) {
		copy(path.join(this.__config.container, destSrc), localSrc, function (err) {
			callback(err);
		});
	} else {
		callback(new Error('LocalSystem: Can\'t download directory - ' + destSrc));
	}
};

module.exports = LocalClient;