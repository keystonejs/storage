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
        StorageClient = require('./');

    function AmazonClient () {

    }

    util.inherits(AmazonClient, StorageClient);

    module.exports = AmazonClient;

})();


