/* ========================================================================
 * StorageAPI: hp.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 19/08/2014
 * ========================================================================
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	AmazonClient = require('./amazon');

var HpClient = function HpClient(config) {

	config = _.extend({
		provider: 'hp'
	}, config);

	this.__ensureValid(['username', 'apiKey', 'region', 'authUrl'], config);

	AmazonClient.super_.call(this, config);

};

util.inherits(HpClient, AmazonClient);

module.exports = HpClient;