/* ========================================================================
 * StorageAPI: ftp.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 19/08/2014
 * ========================================================================
 * FTP Class
 *
 * Requires:
 * - hostname (String) - hostname to connect with
 * - username (String) - username to use while logging in
 * - password (String) - password to login with
 * - path - (String) - path to directory where files should be saved.
 * - url (optional) - if not specified, hostname will be used to generate URLs
 *
 * Creates directory under path if the given one is non-existing.
 * ========================================================================
 */

'use strict';

var util = require('util'),
	path = require('path'),
	StorageClient = require('./'),
	Client = require('jsftp');

var FtpClient = function FtpClient(config) {

	config.url = config.url || 'http://' + config.hostname;

	this.__ensureValid(['host', 'user', 'pass', 'path', 'url'], config);

	FtpClient.super_.call(this, config, new Client(config));

};

util.inherits(FtpClient, StorageClient);

/**
 * {@inheritDoc}
 */
FtpClient.prototype.__ensureContainer = function (callback) {
	this.__connection.raw.mkd(this.__config.path, function (err) {
		callback(err, null);
	});
};

/**
 * {@inheritDoc}
 */
FtpClient.prototype.upload = function (fileSrc, fileName, callback) {
	this.__connection.put(fileSrc, path.join(this.__config.path, fileName), function (err) {
		callback(err, null);
	});
};

module.exports = FtpClient;