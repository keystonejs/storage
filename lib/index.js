/**
 * @fileOverview
 * @author Mike Grabowski (@grabbou)
 * @version 0.2
 */

'use strict';

var _ = require('underscore');

/**
 * Storage object, registers and gets providers upon user request
 * @namespace Storage
 */
var Storage = {

	/**
	 * Config properties for Storage to work
	 * @type {Object}
	 * @private
	 */
	_config: {},

	/**
	 * List of initialized instances
	 * @type {Object}
	 * @private
	 * @see {@link Storage#get} to get an idea how cache is set
	 */
	_cache: {},

	/**
	 * Adds initial config
	 * @param {Object} config containing array with providers
	 */
	init: function (config) {
		this._config = config;
		return this;
	},

	/**
	 * Adds instance to configuration
	 * @param {String} instance name of instance to use across app
	 * @param {Object} config containing provider specific settings
	 * @see {@link Storage#init} for setting multiple providers at once
	 */
	add: function (instance, config) {
		this._config[instance] = config;
		return this;
	},

	/**
	 * Gets an instance of storage provider.
	 * Instance can be omitted to get the default one.
	 * @param {String|Function} instance name of instance to return
	 * @param {?Function} callback
	 */
	get: function (instance, callback) {

		var Client,
			config,
			_this = this;

		// @todo assign default value for instance variable
		if (typeof instance === 'function') {
			callback = instance;
			instance = null;
		}

		if (!instance) {
			return callback(new Error('Storage API: Did you forgot to specify instance?'));
		}

		if (!this._cache[instance]) {

			if (!this._config[instance]) {
				return callback(new Error('Storage API: Instance required does not exists. Did you forgot to declare it?'));
			}

			config = _.omit(this._config[instance], 'provider');

			Client = this._config[instance].provider;

			if (!Client) {
				return callback(new Error('Storage API: Provider for ' + instance + ' is not specified'));
			}

			this._cache[instance] = new Client(config, function (err) {
				if (err) {
					delete _this._cache[instance];
					callback(err);
				} else {
					callback(null, _this._cache[instance]);
				}
			});

		} else {

			this._cache[instance].renew(function (err) {
				callback(err, _this._cache[instance]);
			});

		}

	}

};

/**
 * List of available providers
 * @type {Object.<String,StorageClient>}
 */
Storage.Providers = require('./provider');

module.exports = Storage;
