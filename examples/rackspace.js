// Load env variables
require('dotenv').load();

// Simple initialization
var Storage = require('../lib');

Storage.init({
	rackspace: {
		provider: Storage.Providers.Rackspace,
		container: process.env.RACKSPACE_CONTAINER,
		apiKey: process.env.RACKSPACE_TOKEN,
		username: process.env.RACKSPACE_USERNAME,
		region: process.env.RACKSPACE_REGION
	}
});

Storage.get('rackspace', function (err, client) {

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

