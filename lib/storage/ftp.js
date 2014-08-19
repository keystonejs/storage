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
	_ = require('underscore'),
	StorageClient = require('./');

var FtpClient = function FtpClient(config) {

	config.url = config.url || config.hostname;

	this.__ensureValid(['hostname', 'username', 'password', 'path', 'url'], config);

	StorageClient.super_.call(this, config);

};

util.inherits(FtpClient, StorageClient);

module.exports = FtpClient;