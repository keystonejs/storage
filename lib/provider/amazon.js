/**
 * @fileOverview AmazonS3 integration
 * @author Mike Grabowski (@grabbou)
 * @version 0.2
 */

'use strict';

var util = require('util'),
	fs = require('fs'),
	_ = require('underscore'),
	StorageClient = require('../client'),
	pkgcloud = require('pkgcloud');

/**
 * Creates new Amazon S3 constructor
 * @class
 * @classdesc Amazon integration.
 * Provides a base interface for other `pkgcloud` providers, like *Azure* or *Rackspace*.
 * Explanation:
 * - `container` - name of the cloud container
 * - `path` - path to the file relative to the `container`
 * - `url` - full url to the file
 * @augments StorageClient
 * @param {Object} config
 * @param {function(Error, StorageClient)} callback
 */
var AmazonClient = function AmazonClient(config, callback) {

	/*
	* Only apply for AmazonClient
	* Allows to extend that class by other providers that
	* use pkgcloud (Azure/HP/Rackspace)
	*/
	if(this.constructor === AmazonClient) {
		config = _.extend({
			provider: 'amazon'
		}, config);

		this._ensureValid(['key', 'keyId', 'container'], config);
	}

	AmazonClient.super_.call(this, config, pkgcloud.storage.createClient(config), callback);

};

util.inherits(AmazonClient, StorageClient);

AmazonClient.prototype.upload = function (fileSrc, fileDest, callback) {
	fs.createReadStream(fileSrc).pipe(this._connection.upload({
		container: this._config.container,
		remote: fileDest
	}, callback));
};

AmazonClient.prototype.remove = function (filename, callback) {
	this._connection.removeFile(this._config.container, filename, callback);
};

AmazonClient.prototype.download = function (fileName, fileSrc, callback) {
	var fileStream = fs.createWriteStream(fileSrc);
	this._connection.download({
		container: this._config.container,
		remote: fileName
	}, function (err, results) {
		callback(err, results);
	}).pipe(fileStream);
};

AmazonClient.prototype._init = function (callback) {
	this._connection.createContainer(this._config.container, callback);
};

module.exports = AmazonClient;