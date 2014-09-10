/**
 * @fileOverview Dropbox integration
 * @author Mike Grabowski (@grabbou)
 * @version 0.1
 */

'use strict';

var StorageClient = require('../client'),
	util = require('util');

/**
 * Creates new Dropbox constructor
 * @class
 * @classdesc Dropbox integration
 * @augments StorageClient
 * @param {Object} config
 */
var DropboxClient = function DropboxClient(config) {

};

util.inherits(DropboxClient, StorageClient);

DropboxClient.prototype.upload = function (fileSrc, fileDest, callback) {

};

DropboxClient.prototype.remove = function (filename, callback) {

};

DropboxClient.prototype.download = function (fileName, fileSrc, callback) {

};

DropboxClient.prototype._init = function (callback) {

};

module.exports = DropboxClient;