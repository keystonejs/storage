/* ========================================================================
 * StorageAPI: index.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 14/08/2014
 * ========================================================================
 * Description:
 *
 * Main StorageAPI class. Resolves currently installed modules
 * and returns them to end users. Although it uses process.env variables
 * to load current provider, we can pass options to obtain() method to get
 * different one.
 *
 * Available ways of configuration:
 * 1) Generic -> storageConfig = {}
 * 2) Multiple -> storageConfig[instance] = {}
 *
 * ========================================================================
 */

'use strict';

var StorageClient = require('./storage');

module.exports = {

	__config: undefined,

	/**
	 * Cached object array with all loaded providers (within application)
	 * Shouldn't be called directly. Use obtain() instead
	 */
	__providers: {},

	init: function (config) {
		this.__config = config;
	},

	/**
	 * Returns Storage client instance based on process.env.storage
	 * Pass attribute to get different one than globally set
	 * @var instanceToLoad {String} name of provider to get
	 */
	obtain: function (instanceToLoad) {

		var instance = instanceToLoad || process.env.storage,
			Client,
			config;

		if (!instance) {
			throw new Error('Storage API: Did you forgot to specify provider?');
		}

		if (!this.__config) {
			throw new Error('Storage API: No configuration found. Please specify storage_config');
		}

		if (!this.__providers[instance]) {

			if (!this.__exists(instance)) {
				throw new Error('Storage API: Provider ' + instance + ' is not yet supported');
			}

			config = this.__config[instance] || this.__config;

			Client = require('./storage/' + instance);

			Client = new Client(config);

			if (!(Client instanceof StorageClient)) {
				throw new Error('Storage API: Provider ' + instance + ' is not an instance of StorageClient');
			}

			this.__providers[instance] = Client;

		}

		return this.__providers[instance];
	},

	/**
	 * Checks if instance provider exists
	 * @param instance {String} name of provider to check
	 * @return {Boolean} true if provider exists, false otherwise
	 * @private
	 */
	__exists: function (instance) {
		try {
			return require.resolve('./storage/' + instance).length > 0;
		} catch (error) {
			return false;
		}
	}

};
