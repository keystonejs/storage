/* ========================================================================
 * StorageAPI: amazon.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 14/08/2014
 * ========================================================================
 * Description: Amazon S3 file provider
 * ========================================================================
 */

(function () {
    'use strict';

    var util = require('util'),
        _ = require('underscore'),
        StorageClient = require('./'),
        pkgcloud = require('pkgcloud');

    /**
     * Amazon S3 constructor
     * @param config
     * @constructor
     */
    function AmazonClient (config) {

        // Extending config with pkgcloud specific options
        _.extend({
            name: 'amazon'
        }, config);

        // Calling super constructor to finish initialization
        AmazonClient.super_(this, config, pkgcloud.storage.createClient(config));

    }

    // Inheriting interface & methods
    util.inherits(AmazonClient, StorageClient);

    AmazonClient.prototype = {

        /**
         * {@inheritDoc}
         */
        __ensureContainer: function (callback) {
            this.__connection.createContainer(this.__config, callback);
        }

    };

    module.exports = AmazonClient;

})();


