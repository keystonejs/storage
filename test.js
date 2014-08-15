var Storage = require('./index');

Storage.init({
    amazon: {
        container: '',
        key: '',
        keyId: ''
    }
});

console.log(process.env.storageConfig);

var client = Storage.obtain('amazon');

console.log(client.upload());