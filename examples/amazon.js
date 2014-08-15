// Load env variables
require('dotenv').load();

// Simple initialization
var Storage = require('../lib');

Storage.init({
	amazon: {
		container: process.env.TEST_CONTAINER,
		key: process.env.TEST_KEY,
		keyId: process.env.TEST_KEYID
	}
});

// Because no process.env.storage is specified, we use 'amazon' for now
var client = Storage.obtain('amazon');

// As long as not implemented, will raise an error here
client.upload('../LICENSE', 'license.md', function (err) {
	if (err) {
		console.log(err.message);
	} else {
		console.log('Uploaded');
	}
});