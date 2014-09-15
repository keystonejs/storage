/**
 * @fileOverview FileSystem integration
 * @author Mike Grabowski (@grabbou)
 * @version 0.2
 */

'use strict';

var util = require('util'),
	StorageClient = require('../client'),
	waterfall = require('async').waterfall,
	path = require('path'),
	fs = require('fs-extra');

/**
 * Creates new LocalClient instance
 * @class
 * @classdesc Filesystem integration for operating on files locally.
 * Explanation:
 * - `container` - root folder to store the files within
 * - `path` - path to the file relative to the `container`
 * - `filename` - name of the file extracted from `path`
 * - `url` - blank, no web access by default
 * @augments StorageClient
 * @param {Object} config
 */
var LocalClient = function LocalClient(config) {

	this._ensureValid(['container'], config);

	LocalClient.super_.call(this, config, null);

};

util.inherits(LocalClient, StorageClient);

LocalClient.prototype._init = function (callback) {
	fs.ensureDir(this._config.container, callback);
};

LocalClient.prototype.upload = function (localSrc, destSrc, callback) {

	var container = this._config.container,
		destPath = path.dirname(destSrc),
		fileName = path.basename(destSrc);

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
						path: path.join(destPath, fileName),
						filename: fileName,
						url: ''
					});
				}
			});
		}
	], callback);

};

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
				if(err || stat.isDirectory()) err = new Error('LocalSystem: Can\'t remove entire directory');
				callback(err);
			});
		},
		function (callback) {
			fs.unlink(destSrc, function (err) {
				if(err) err.message = 'LocalSystem: Can\'t remove file. Details: ' + err.message;
				callback(err);
			});
		}
	], callback);
};

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
				if(err || stat.isDirectory()) err = new Error('LocalSystem: Can\'t download directory');
				callback(err);
			});
		},
		function (callback) {
			fs.copy(destSrc, localSrc, function (err) {
				err = err && err[0] ? err[0] : err;
				if(err) err.message = 'LocalSystem: There was a problem with downloading ' + destSrc;
				callback(err);
			});
		}
	], callback);

};

module.exports = LocalClient;