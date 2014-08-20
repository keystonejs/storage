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

var StorageClient = require('./storage'),
	_ = require('underscore');

var Storage = {

	Providers: {
		AmazonS3: require('./storage/amazon'),
		Azure: require('./storage/azure'),
		Hp: require('./storage/hp'),
		LocalSystem: require('./storage/local'),
		OpenStack: require('./storage/openstack'),
		RackSpace: require('./storage/rackspace')
	},

	_config: undefined,

	/**
	 * List of initialized instances
	 */
	_cache: {},

	/**
	 * Adds initial config
	 * @param config {Object} containing object array similar to add() params
	 */
	init: function (config) {
		this._config = config;
	},

	/**
	 * Adds instance to configuration
	 * @param instance {String} name of instance to use across app
	 * @param config {Object} containing provider specific config
	 */
	add: function (instance, config) {
		this._config[instance] = config;
	},

	/**
	 * Gets an instance of storage provider
	 * @param instance {String} name of instance to return
	 * @returns {StorageClient}
	 */
	get: function (instance) {

		var Client,
			config;

		if (!instance) {
			throw new Error('Storage API: Did you forgot to specify provider?');
		}

		if (!this._cache[instance]) {

			if (!this._config[instance]) {
				throw new Error('Storage API: Instance required does not exists. Did you forgot to declare it?');
			}

			/*!
			 * We are not going to pass provider reference to itself
			 * PKGCloud uses provider property as it's more safe to delete
			 * it here
			 */
			config = _.omit(this._config[instance], 'provider');

			Client = this._config[instance].provider;

			Client = new Client(config);

			if (!(Client instanceof StorageClient)) {
				throw new Error('Storage API: Provider ' + instance + ' is not an instance of StorageClient');
			}

			this._cache[instance] = Client;

		}

		return this._cache[instance];

	}

};

module.exports = Storage;
