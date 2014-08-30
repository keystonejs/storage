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
	 * Gets an instance of a storage provider
	 * @param {String} instance name to create
	 * @throws Will throw an error if either config or provider for a given instance is invalid
	 * @returns {StorageClient}
	 * @see {@link Storage#get} for complete initialization
	 * @private
	 */
	_getInstance: function (instance) {

		var Client,
			config;

		if (!this._cache[instance]) {

			if (!this._config[instance]) {
				throw new Error('Storage API: Instance required does not exists. Did you forgot to declare it?');
			}

			config = _.omit(this._config[instance], 'provider');

			Client = this._config[instance].provider;

			if (!Client) {
				throw new Error('Storage API: Provider for ' + instance + ' is not specified');
			}

			this._cache[instance] = new Client(config);

		}

		return this._cache[instance];

	},

	/**
	 * Gets and initialises an instance of storage provider
	 * @param {String|Function} instance name of instance to return
	 * @param {?Function} callback
	 */
	get: function (instance, callback) {

		if (typeof instance === 'function') {
			callback = instance;
			instance = null;
		}

		var Client = this._getInstance(instance);

		Client._init(function (err) {
			if (err) {
				callback(err);
			} else {
				callback(null, Client);
			}
		});

	},

	/**
	 * Sets pre hook
	 * @param {String=} instance name to set hook for
	 * @param {String|Function} method to set hook for
	 * @param {?Function} callback
	 * @see {@link StorageClient} for hooks initialisation
	 */
	pre: function (instance, method, callback) {

		var _this = this;

		if (typeof method === 'function') {

			// arguments replacing
			callback = method;
			method = instance;

			_.each(this._config, function (data, instance) {
				_this._getInstance(instance).pre(method, callback);
			});

		} else {
			_this._getInstance(instance).pre(method, callback);
		}

	},

	/**
	 * Sets post hook
	 * @param {String} instance name to set hook for
	 * @param {String|Function} method to set hook for
	 * @param {?Function} callback
	 * @see {@link StorageClient} for hooks initialisation
	 */
	post: function (instance, method, callback) {

		var _this = this;

		if (typeof method === 'function') {

			// arguments replacing
			callback = method;
			method = instance;

			_.each(this._config, function (data, instance) {
				_this._getInstance(instance).post(method, callback);
			});

		} else {
			_this._getInstance(instance).post(method, callback);
		}
	}

};

/**
 * List of available providers
 * @type {Object.<String,StorageClient>}
 */
Storage.Providers = require('./provider');

module.exports = Storage;
