/* ========================================================================
 * StorageAPI: azure.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 15/08/2014
 * ========================================================================
 * Description: Azure client
 * ========================================================================
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	AmazonClient = require('./amazon');

var AzureClient = function AzureClient(config) {

	config = _.extend({
		provider: 'azure'
	}, config);

	AzureClient.super_.call(this, config);

};

util.inherits(AzureClient, AmazonClient);

module.exports = AzureClient;