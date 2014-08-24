// Simple initialization
var Storage = require('../lib'),
	async = require('async');

Storage.init({
	custom: {
		provider: Storage.Providers.LocalSystem,
		container: 'practical'
	}
});

Storage.get('custom', function (err, client) {
	async.waterfall([
		function uploadFile(callback) {
			client.upload('../LICENSE', 'testing/license.md', function (err, res) {
				console.log(res);
				callback(err);
			});
		},
		function downloadFile(callback) {
			client.download('testing/license.md', 'license2.md', function (err) {
				callback(err);
			});
		},
		function removeFile(callback) {
			client.remove('testing/license.md', function (err) {
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
});





