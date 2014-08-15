StorageAPI
==========

**WIP. Please stay tuned**

StorageAPI is node.js library that abstract away differences between multiple storage providers giving you the ability to implement real Storage API inside your application.

## Why?

If you ever wanted to implement Storage API right in your application giving other contributors and developers an easy access to file system - that's for you. Write simple & portable plugins that work with any provider possible (Amazon/Azure/FTP/SFTP and so on).

## Initialization

After requiring for the first time, invoke `init` method by passing configuration object.

```js
var Storage = require('storage-api');
Storage.init({
	amazon: {
		container: '',
		key: '',
		keyId: ''
});
```
It can be either multidimensional array containing provider name as a key (useful when you are going to use multiple providers) as shown above or default, global config, like the one below:

```js
var Storage = require('storage-api');
Storage.init({
 		container: '',
 		key: '',
 		keyId: ''
});
```

Every storage provider requires slightly different parameters. See sections below for further information.

## Usage

To get instance of current client, simply call `obtain()` on your `Storage` object.

```js
var Storage = require('storage-api');

var client = Storage.obtain();

client.upload(...);
```

`Obtain()` method can accept provider to retrieve (`String`) as a parameter. In case it's undefined, method looks for `process.env.storage` for default value.

## Contributing

Feel free to submit an issue or pull-request. Keep in mind that we follow [Airbnb style guide](https://github.com/airbnb/javascript) except the fact, that we use 1 tab over 2/4 spaces. This originates from KeystoneJS which that project is a part of.

To add your own provider, simply take a look at `AmazonClient` class for further reference. Detailed docs are coming!