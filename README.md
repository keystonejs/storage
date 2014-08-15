StorageAPI
==========

**WIP. Please stay tuned**

StorageAPI is node.js library that abstract away differences between multiple storage providers giving you the ability to implement real Storage API inside your application.

## Why?

If you ever wanted to implement Storage API right in your application giving other contributors and developers an easy access to file system - that's for you. Write simple & portable plugins that work with every provider possible (Amazon/Azure/FTP/SFTP and so on).

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

`Obtain()` method can accept provider to retrieve (`String`) as parameter. In case not specified, method will look for `process.env.storage` for default value.