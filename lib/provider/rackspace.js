/* ========================================================================
 * StorageAPI: rackspace.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 19/08/2014
 * ========================================================================
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	AmazonClient = require('./amazon');

var RackspaceClient = function RackspaceClient(config) {

	config = _.extend({
		provider: 'rackspace'
	}, config);

	this._ensureValid(['username', 'apiKey', 'region'], config);

	AmazonClient.super_.call(this, config);

};

util.inherits(RackspaceClient, AmazonClient);

module.exports = RackspaceClient;