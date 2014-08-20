// Simple initialization
var Storage = require('../lib'),
	async = require('async');

Storage.init({
	custom: {
		provider: Storage.Providers.LocalSystem,
		path: 'practical'
	}
});

// Because no process.env.storage is specified, we use 'amazon' for now
var client = Storage.get('custom');

async.waterfall([
	function uploadFile(callback) {
		client.upload('../LICENSE', 'license.md', function (err) {
			callback(err);
		});
	},
	function downloadFile(callback) {
		client.download('license.md', 'practical/license2.md', function (err) {
			callback(err);
		});
	},
	function removeFile(callback) {
		client.remove('license2.md', function (err) {
			callback(err);
		});
	}
], function (err) {
	if (err) {
		console.log('Error - ', err);
	} else {
		console.log('Successful');
	}
});




