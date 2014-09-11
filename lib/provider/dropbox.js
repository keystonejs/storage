/**
 * @fileOverview Dropbox integration
 * @author Mike Grabowski (@grabbou)
 * @version 0.1
 */

'use strict';

var StorageClient = require('../client'),
	Dropbox = require('dropbox'),
	async = require('async'),
	path = require('path'),
	util = require('util'),
	fs = require('fs'),
	_ = require('underscore');

/**
 * Creates new Dropbox constructor
 * @class
 * @classdesc Dropbox integration
 * Explanation:
 * - `token` - Dropbox API token for your application
 * - `folder` - Folder app should use. If your app is limited to specific folder,
 * you can skip that field.
 * @augments StorageClient
 * @param {Object} config
 */
var DropboxClient = function DropboxClient(config) {

	var client;

	config = _.defaults(config, {
		folder: ''
	});

	this._ensureValid(['token', 'folder'], config);

	client = new Dropbox.Client({
		token: config.token
	});

	DropboxClient.super_.call(this, config, client);
};

util.inherits(DropboxClient, StorageClient);

DropboxClient.prototype.upload = function (fileSrc, fileDest, callback) {

	var folderName = this._config.folder,
		destPath = path.join(folderName, fileDest),
		destName = path.basename(fileDest),
		client = this._connection;

	async.waterfall([

		// Returns file readStream
		function (callback) {
			fs.readFile(fileSrc, callback);
		},

		// Writes file to dropbox cloud
		function (buffer, callback) {
			client.writeFile(destPath, buffer, callback);
		},

		// Makes Url
		function (stat, callback) {
			client.makeUrl(destPath, {download: true}, callback);
		},

		// Returns object
		function (file, callback) {
			callback(null, {
				container: folderName,
				path: destPath,
				filename: destName,
				url: file.url
			});
		}

	], callback);

};

DropboxClient.prototype.remove = function (filename, callback) {

};

DropboxClient.prototype.download = function (fileName, fileSrc, callback) {

};

DropboxClient.prototype._init = function (callback) {
	callback();
};

module.exports = DropboxClient;