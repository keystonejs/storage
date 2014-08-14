var Storage = require('./index');

var client = Storage.obtain('amazon');

console.log(client);