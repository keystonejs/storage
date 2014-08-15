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

(function () {
    'use strict';

    module.exports = {

        __config: {},

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

            var instance = instanceToLoad || process.env.storage;

            if (!instance) {
                throw new Error('Storage API: Did you forgot to specify provider?');
            }

            if (!this.__providers[instance]) {

                if (!this.__exists(instance)) {
                    throw new Error('Storage API: Provider ' + instance + ' is not yet supported');
                }

                var Client = require('./provider/' + instance);

                if (!this.__isInstance(Client)) {
                    throw new Error('Storage API: Provider ' + instance + ' is not an instance of StorageClient');
                }

                if (!this.__config) {
                    throw new Error('Storage API: No configuration found. Please specify storage_config');
                }

                var config = this.__config[instance] || this.__config;

                if (!config) {
                    throw new Error('Storage API: No config found for ' + instance + '. Please check your files');
                }

                this.__providers[instance] = new Client(config);

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
                return require.resolve('./provider/' + instance);
            } catch (error) {
                return false;
            }
        },

        /**
         * Checks whether loaded package is instance of StorageClient
         * Notice that check is performed before initialization
         * @param instance {Object}
         * @return {Boolean} true if valid, false otherwise
         * @private
         */
        __isInstance: function (instance) {
            if (!instance.super_) return false;
            var text = Function.prototype.toString.call(instance.super_);
            return text.match(/function (.*)\(/)[1] === 'StorageClient';
        }

    };

})();
