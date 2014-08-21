/* ========================================================================
 * StorageAPI: amazon.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 14/08/2014
 * ========================================================================
 * Description: Amazon S3 file provider
 * ========================================================================
 */

'use strict';

var util = require('util'),
	fs = require('fs'),
	_ = require('underscore'),
	StorageClient = require('../client'),
	pkgcloud = require('pkgcloud');

/**
 * Amazon S3 constructor
 * @param config
 * @constructor
 */
var AmazonClient = function AmazonClient(config) {

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

	AmazonClient.super_.call(this, config, pkgcloud.storage.createClient(config));

};

util.inherits(AmazonClient, StorageClient);

/**
 * {@inheritDoc}
 */
AmazonClient.prototype.upload = function (fileSrc, fileDest, callback) {
	fs.createReadStream(fileSrc).pipe(this._connection.upload({
		container: this._config.container,
		remote: fileDest
	}, callback));
};

/**
 * {@inheritDoc}
 */
AmazonClient.prototype.remove = function (filename, callback) {
	this._connection.removeFile(this._config.container, filename, callback);
};

/**
 * {@inheritDoc}
 */
AmazonClient.prototype.download = function (fileName, fileSrc, callback) {
	var fileStream = fs.createWriteStream(fileSrc);
	this._connection.download({
		container: this._config.container,
		remote: fileName
	}, function (err, results) {
		callback(err, results);
	}).pipe(fileStream);
};

/**
 * {@inheritDoc}
 */
AmazonClient.prototype._ensureContainer = function (callback) {
	this._connection.createContainer(this._config.container, callback);
};

module.exports = AmazonClient;