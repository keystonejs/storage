// Simple initialization
var Storage = require('./index');

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
console.log(client.upload());