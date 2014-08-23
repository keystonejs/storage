/* ========================================================================
 * StorageAPI: storage.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 21/08/2014
 * ========================================================================
 */

/* jshint unused: false */

'use strict';

/**
 * Initializes StorageClient, connection and saves config
 * Creates container/folder to use if necessary
 * @param config {Object} containing provider-specific data
 * @param connection {Object} containing reference to connection method
 * @constructor
 */
var StorageClient = function StorageClient(config, connection) {

	var _this = this;

	if (this.constructor === StorageClient) {
		throw new Error('StorageClient: Cannot initialize abstract class');
	}

	this._config = config;
	this._connection = connection;

	this._registerHooks();

	this._ensureContainer(function onEnsured(err) {
		if (err) {
			throw new Error(_this.constructor.name +': There was a problem with initialization. Details: ' + err.message);
		}
	});

};

/**
 * Uploads given file
 * @param localSrc {String} local path to the file
 * @param destSrc {String} dest path to save the file
 * @param callback {Function} to invoke after completing
 * @abstract
 * @access public
 */
StorageClient.prototype.upload = function (localSrc, destSrc, callback) {
	throw new Error('Cannot invoke abstract method');
};

/**
 * Removes given file
 * @param destSrc {String} dest path to delete
 * @param callback {Function} to invoke after completing
 * @abstract
 * @access public
 */
StorageClient.prototype.remove = function (destSrc, callback) {
	throw new Error('Cannot invoke abstract method');
};

/**
 * Downloads given file
 * @param destSrc {String} to download
 * @param localSrc {String} path to save the file (with filename)
 * @param callback {Function} to invoke after downloading
 * @abstract
 * @access public
 */
StorageClient.prototype.download = function (destSrc, localSrc, callback) {
	throw new Error('Cannot invoke abstract method');
};

/**
 * Ensures that container/folder we want to use is defined and created
 * @param callback {Function} to be invoked after completion
 * @public
 * @abstract
 * @access protected
 */
StorageClient.prototype._ensureContainer = function (callback) {
	throw new Error('Cannot invoke abstract method');
};

/**
 * Checks whether config passed is valid
 * @param schema
 * @param config
 * @access protected
 */
StorageClient.prototype._ensureValid = function (schema, config) {

	var _this = this;

	if (typeof schema === 'string') schema = [schema];

	schema.forEach(function (key) {
		if (!config.hasOwnProperty(key)) {
			throw new Error(_this.constructor.name + ': Missing argument for ' + key + '. Check the docs for further assistance');
		}
	});
};

/**
 * Registers hooks (pre/post - upload/download/remove)
 * @private
 */
StorageClient.prototype._registerHooks = function () {

	var hooks = require('hooks'),
		fs = require('fs'),
		_this = this;

	// As stated by Hooks.js authors
	for (var k in hooks) {
		this[k] = hooks[k];
	}

	this.hook('upload', this.upload);
	this.hook('download', this.download);
	this.hook('remove', this.remove);

	this.pre('upload', function (next, localSrc) {
		fs.stat(localSrc, function (err, stat) {
			var error = err || stat.isDirectory() ? new Error(_this.constructor.name +': Can\'t upload directory') : null;
			next(error);
		});
	});

};

module.exports = StorageClient;
