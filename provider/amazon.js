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
function AmazonClient(config) {

	// Extending config with pkgcloud specific options
	config = _.extend({
		provider: 'amazon'
	}, config);

	// Calling super constructor to finish initialization
	AmazonClient.super_.call(this, config, pkgcloud.storage.createClient(config));

}

// Inheriting interface & methods
util.inherits(AmazonClient, StorageClient);

AmazonClient.prototype = {

	/**
	 * {@inheritDoc}
	 */
	upload: function (fileSrc, fileName, callback) {

		fs.createReadStream(fileSrc).pipe(this.__connection.upload({
			container: this.__config.container,
			remote: fileName
		}, callback));

	},

	/**
	 * {@inheritDoc}
	 */
	remove: function (filename, callback) {
		this.__connection.removeFile(this.__config.container, filename, callback);
	},

	/**
	 * {@inheritDoc}
	 */
	download: function (filename, fileSrc, callback) {
		this.__connection.download({
			container: this.__config.container,
			remote: filename
		}, callback).pipe(fs.createWriteStream(fileSrc));
	},

	/**
	 * {@inheritDoc}
	 */
	__ensureContainer: function (callback) {
		this.__connection.createContainer(this.__config.container, callback);
	}

};

module.exports = AmazonClient;


