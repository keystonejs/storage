var Storage = require('./index');


process.env.storageConfig = {
    amazon: {

    }
};

var client = Storage.obtain('amazon');

console.log(client);