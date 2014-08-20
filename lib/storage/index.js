/* ========================================================================
 * StorageAPI: index.js v0.0.1
 * Author: Mike Grabowski (@grabbou)
 * Created at: 14/08/2014
 * ========================================================================
 * Description: Abstract StorageAPI client provider. Ensures all of the
 * providers integrated within that package implement all of the required
 * methods. Every package needs to inherit from that abstract one to work.
 * ========================================================================
 */

exports.AmazonS3 = require('./amazon');
exports.Azure = require('./azure');
exports.Hp = require('./hp');
exports.LocalSystem = require('./local');
exports.OpenStack = require('./openstack');
exports.Rackspace = require('./rackspace');