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
	StorageClient = require('./'),
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

		this.__ensureValid(['key', 'keyId', 'container'], config);
	}

	AmazonClient.super_.call(this, config, pkgcloud.storage.createClient(config));

};

util.inherits(AmazonClient, StorageClient);

/**
 * {@inheritDoc}
 */
AmazonClient.prototype.upload = function (fileSrc, fileName, callback) {
	fs.createReadStream(fileSrc).pipe(this.__connection.upload({
		container: this.__config.container,
		remote: fileName
	}, callback));
};

/**
 * {@inheritDoc}
 */
AmazonClient.prototype.remove = function (filename, callback) {
	this.__connection.removeFile(this.__config.container, filename, callback);
};

/**
 * {@inheritDoc}
 */
AmazonClient.prototype.download = function (fileName, fileSrc, callback) {
	var fileStream = fs.createWriteStream(fileSrc);
	this.__connection.download({
		container: this.__config.container,
		remote: fileName
	}, function (err, results) {
		callback(err, results);
	}).pipe(fileStream);
};

/**
 * {@inheritDoc}
 */
AmazonClient.prototype.__ensureContainer = function (callback) {
	this.__connection.createContainer(this.__config.container, callback);
};

module.exports = AmazonClient;