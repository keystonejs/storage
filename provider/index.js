/* ========================================================================
 * StorageAPI: index.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 14/08/2014
 * ========================================================================
 * Description: Abstract StorageAPI client provider. Ensures all of the
 * providers integrated within that package implement all of the required
 * methods. Every package needs to inherit from that abstract one to work.
 * ========================================================================
 */

/* jshint unused: false */

'use strict';

/**
 * Initializes StorageClient, connection and saves config
 * Creates container/folder to use if necessary
 * @param config {Object} containing provider-specific data
 * @param connection {Object} containing connection instance
 * @constructor
 */
function StorageClient(config, connection) {
	if (this.constructor === StorageClient) {
		throw new Error('StorageClient: Cannot initialize abstract class');
	}

	this.__config = config;
	this.__connection = connection;

	this.__ensureContainer(function (err) {
		if (err) {
			throw new Error('StorageClient: There was a problem with initialization. Details: ' + err.message);
		}
	});
}

StorageClient.prototype = {

	/**
	 * Uploads given file
	 * @param fileSrc {String} path to the file
	 * @param filename {String} name of the file
	 * @param callback {Function} to invoke after completing
	 * @abstract
	 * @access public
	 */
	upload: function (fileSrc, filename, callback) {
		throw new Error('Cannot invoke abstract method');
	},

	/**
	 * Removes given file
	 * @param filename {String} filename to delete
	 * @param callback {Function} to invoke after completing
	 * @abstract
	 * @access public
	 */
	remove: function (filename, callback) {
		throw new Error('Cannot invoke abstract method');
	},

	/**
	 * Downloads given file
	 * @param filename {String} to download
	 * @param fileSrc {String} path to save the file
	 * @param callback {Function} to invoke after downloading
	 * @abstract
	 * @access public
	 */
	download: function (filename, fileSrc, callback) {
		throw new Error('Cannot invoke abstract method');
	},

	/**
	 * Ensures that container/folder we want to use is defined and created
	 * @param callback {Function} to be invoked after completion
	 * @private
	 * @abstract
	 * @access private
	 */
	__ensureContainer: function (callback) {
		throw new Error('Cannot invoke abstract method');
	}

};

module.exports = StorageClient;

