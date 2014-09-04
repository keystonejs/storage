/**
 * @fileOverview OpenStack integration
 * @author Mike Grabowski (@grabbou)
 * @version 0.2
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	AmazonClient = require('./amazon');

/**
 * Creates new OpenStack instance
 * @class
 * @classdesc OpenStack integration.
 * Explanation:
 * - `container` - name of the cloud container
 * - `path` - path to the file relative to the `container`
 * - `url` - full url to the file
 * @augments AmazonClient
 * @param {Object} config
 */
var OpenstackClient = function OpenstackClient(config) {

	config = _.extend({
		provider: 'hp'
	}, config);

	this._ensureValid(['username', 'password', 'authUrl'], config);

	OpenstackClient.super_.call(this, config);

};

util.inherits(OpenstackClient, AmazonClient);

module.exports = OpenstackClient;