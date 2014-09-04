/**
 * @fileOverview Rackspace integration
 * @author Mike Grabowski (@grabbou)
 * @version 0.2
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	AmazonClient = require('./amazon');

/**
 * Creates new Rackspace instance
 * @class
 * @classdesc Rackspace integration.
 * Explanation:
 * - `container` - name of the cloud container
 * - `path` - path to the file relative to the `container`
 * - `url` - full url to the file
 * @augments AmazonClient
 * @param {Object} config
 */
var RackspaceClient = function RackspaceClient(config) {

	config = _.extend({
		provider: 'rackspace'
	}, config);

	this._ensureValid(['username', 'apiKey', 'region'], config);

	RackspaceClient.super_.call(this, config);

};

util.inherits(RackspaceClient, AmazonClient);

module.exports = RackspaceClient;