/* ========================================================================
 * StorageAPI: openstack.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 19/08/2014
 * ========================================================================
 */

'use strict';

var util = require('util'),
	_ = require('underscore'),
	AmazonClient = require('./amazon');

var OpenstackClient = function OpenstackClient(config) {

	config = _.extend({
		provider: 'hp'
	}, config);

	this._ensureValid(['username', 'password', 'authUrl'], config);

	AmazonClient.super_.call(this, config);

};

util.inherits(OpenstackClient, AmazonClient);

module.exports = OpenstackClient;