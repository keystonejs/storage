/* jshint unused: false */

/**
 * @fileOverview
 * @author Mike Grabowski (@grabbou)
 * @version 0.2
 */

'use strict';

/**
 * Constructs new StorageClient class
 * @class
 * @classdesc Abstract class containing common properties and methods
 * @param {Object} config for a current provider
 * @param {Object} connection containing usually 3rd-party library
 */
var StorageClient = function StorageClient(config, connection) {

	if (this.constructor === StorageClient) {
		throw new Error('StorageClient: Cannot initialize abstract class');
	}

	this._config = config;
	this._connection = connection;

	this._registerHooks();

};

/**
 * Registers hooks (pre/post - upload/download/remove)
 * @private
 */
StorageClient.prototype._registerHooks = function () {

	var hooks = require('hooks');

	// As stated by Hooks.js authors
	for (var k in hooks) {
		this[k] = hooks[k];
	}

	this.hook('upload', this.upload);
	this.hook('download', this.download);
	this.hook('remove', this.remove);

};

/**
 * Checks whether config is valid
 * @param {Array} schema containing config-keys
 * @param {Object} config passed to validate
 * @see {@link AmazonClient} constructor for example
 * @protected
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
 * Init connection
 * @param {function(?Error=)} callback
 * @see {@link Storage#get}
 * @protected
 * @abstract
 */
StorageClient.prototype._init = function (callback) {
	throw new Error('Cannot invoke abstract method');
};

/**
 * Uploads given file
 * @param {string} localSrc to the file
 * @param {string} destSrc to save the file
 * @param {function(?Error, results.<Object>)} callback
 * @public
 * @abstract
 */
StorageClient.prototype.upload = function (localSrc, destSrc, callback) {
	throw new Error('Cannot invoke abstract method');
};

/**
 * Removes given file
 * @param {String} destSrc to delete the file
 * @param {function(?Error=)} callback
 * @public
 * @abstract
 */
StorageClient.prototype.remove = function (destSrc, callback) {
	throw new Error('Cannot invoke abstract method');
};

/**
 * Downloads given file
 * @param {String} destSrc to download
 * @param {String} localSrc to save the file
 * @param {function(?Error=)} callback
 * @public
 * @abstract
 */
StorageClient.prototype.download = function (destSrc, localSrc, callback) {
	throw new Error('Cannot invoke abstract method');
};

/**
 * Cleans up resources used by an instance
 * @param {function(?Error=)} callback
 * @private
 */
StorageClient.prototype._exit = function (callback) {
	callback();
};

module.exports = StorageClient;
