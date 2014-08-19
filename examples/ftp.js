// Load env variables
require('dotenv').load();

// Simple initialization
var Storage = require('../lib');

Storage.init({
	ftp: {
		host: process.env.TEST_FTP_HOSTNAME,
		user: process.env.TEST_FTP_USERNAME,
		pass: process.env.TEST_FTP_PASSWORD,
		path: process.env.TEST_FTP_PATH,
		port: 22
	}
});

// Because no process.env.storage is specified, we use 'ftp' for now
var ftp = Storage.obtain('ftp');
