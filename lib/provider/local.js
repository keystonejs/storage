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
	fs = require('fs-extra');

var LocalClient = function LocalClient(config) {

	this._ensureValid(['container'], config);

	LocalClient.super_.call(this, config);

};

util.inherits(LocalClient, StorageClient);

/**
 * {@inheritDoc}
 */
LocalClient.prototype._ensureContainer = function (callback) {
	fs.ensureDir(this._config.container, callback);
};

/**
 * {@inheritDoc}
 */
LocalClient.prototype.upload = function (localSrc, destSrc, callback) {

	var container = this._config.container,
		destPath = path.dirname(destSrc),
		destName = path.basename(destSrc);

	destSrc = path.join(container, destSrc);

	waterfall([
		function (callback) {
			fs.stat(localSrc, function (err, stat) {
				var error = err || stat.isDirectory() ? new Error('LocalSystem: Can\'t upload entire directory') : null;
				callback(error);
			});
		},
		function (callback) {
			fs.ensureDir(path.join(container, destPath), function (err) {
				var error = err ? new Error('LocalSystem: Can\'t ensure directory ' + destPath + ', code: ' + err.errno) : null;
				callback(error);
			});
		},
		function (callback) {
			fs.copy(localSrc, destSrc, function (err) {
				if (err) {
					// possible bug in copy library returning array instead of single error
					err = err[0] || err;
					var error = err ? new Error('LocalSystem: There was a problem with uploading ' + localSrc + ', code: ' + err.errno) : null;
					callback(error);
				} else {
					callback(null, {
						container: container,
						path: destPath,
						filename: destName,
						url: destSrc
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

	destSrc = path.join(this._config.container, destSrc);

	waterfall([
		function (callback) {
			fs.exists(destSrc, function (exists) {
				var error = !exists ? new Error('LocalSystem: Can\'t remove non-existing file') : null;
				callback(error);
			});
		},
		function (callback) {
			fs.stat(destSrc, function (err, stat) {
				var error = err || stat.isDirectory() ? new Error('LocalSystem: Can\'t remove entire directory') : null;
				callback(error);
			});
		},
		function (callback) {
			fs.unlink(destSrc, function (err) {
				callback(err);
			});
		}
	], callback);
};

/**
 * {@inheritDoc}
 */
LocalClient.prototype.download = function (destSrc, localSrc, callback) {

	destSrc = path.join(this._config.container, destSrc);

	waterfall([
		function (callback) {
			fs.exists(destSrc, function (exists) {
				var error = !exists ? new Error('LocalSystem: Can\'t download non-existing file') : null;
				callback(error);
			});
		},
		function (callback) {
			fs.stat(destSrc, function (err, stat) {
				var error = err || stat.isDirectory() ? new Error('LocalSystem: Can\'t download directory') : null;
				callback(error);
			});
		},
		function (callback) {
			fs.copy(destSrc, localSrc, function (err) {
				err = err && err[0] ? err[0] : err;
				var error = err ? new Error('LocalSystem: There was a problem with downloading ' + destSrc + ', code: ' + err.errno) : null;
				callback(error);
			});
		}
	], callback);

};

module.exports = LocalClient;