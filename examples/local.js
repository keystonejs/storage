// Simple initialization
var Storage = require('../lib');

Storage.init({
	local: {
		path: 'practical'
	}
});

// Because no process.env.storage is specified, we use 'amazon' for now
var client = Storage.obtain('local');

client.upload('../LICENSE', 'license.md', function (err) {
	if (err) {
		console.log(err.message);
	} else {
		console.log('Uploaded');
	}
});

client.download('license.md', 'practical/license2.md', function (err) {
	if (err) {
		console.log(err.message);
	} else {
		console.log('Downloaded');
	}
});

client.remove('license2.md', function (err) {
	if (err) {
		console.log(err.message);
	} else {
		console.log('Removed');
	}
});