// Load env variables
require('dotenv').load();

// Simple initialization
var Storage = require('../lib');

Storage.init({
	amazon: {
		provider: Storage.Providers.AmazonS3,
		container: process.env.TEST_CONTAINER,
		key: process.env.TEST_KEY,
		keyId: process.env.TEST_KEYID
	}
});

Storage.get('amazon', function (err, client) {

	if (err) console.log(err);

	// As long as not implemented, will raise an error here
	client.upload('../LICENSE', 'license.md', function (err, data) {
		if (err) {
			console.log(err.message);
		} else {
			console.log(data);
		}
	});

});

