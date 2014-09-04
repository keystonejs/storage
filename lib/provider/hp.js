/**
 * @fileOverview HP integration
 * @author Mike Grabowski (@grabbou)
 * @version 0.2
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	AmazonClient = require('./amazon');

/**
 * Creates new HP instance
 * @class
 * @classdesc HP integration.
 * Explanation:
 * - `container` - name of the cloud container
 * - `path` - path to the file relative to the `container`
 * - `url` - full url to the file
 * @augments AmazonClient
 * @param {Object} config
 */
var HpClient = function HpClient(config) {

	config = _.extend({
		provider: 'hp'
	}, config);

	this._ensureValid(['username', 'apiKey', 'region', 'authUrl'], config);

	HpClient.super_.call(this, config);

};

util.inherits(HpClient, AmazonClient);

module.exports = HpClient;