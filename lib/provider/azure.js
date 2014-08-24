/**
 * @fileOverview Azure integration
 * @author Mike Grabowski (@grabbou)
 * @version 0.2
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	AmazonClient = require('./amazon');

/**
 * Creates new Azure instance
 * @class
 * @classdesc Azure integration.
 * Explanation:
 * - `container` - name of the cloud container
 * - `path` - path to the file relative to the `container`
 * - `filename` - basename extracted from `path`
 * - `url` - full url to the file
 * @augments AmazonClient
 * @param {Object} config
 */
var AzureClient = function AzureClient(config) {

	config = _.extend({
		provider: 'azure'
	}, config);

	this._ensureValid(['container', 'storageAccount', 'storageAccessKey'], config);

	AzureClient.super_.call(this, config);

};

util.inherits(AzureClient, AmazonClient);

module.exports = AzureClient;