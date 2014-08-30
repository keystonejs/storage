Storage.js [![Travis-Ci](https://travis-ci.org/keystonejs/storage.js.svg)](https://travis-ci.org/keystonejs/storage.js)&nbsp;[![Code Climate](https://codeclimate.com/github/keystonejs/storage.js/badges/gpa.svg)](https://codeclimate.com/github/keystonejs/storage.js)&nbsp;[![Test Coverage](https://codeclimate.com/github/keystonejs/storage.js/badges/coverage.svg?v=2)](https://codeclimate.com/github/keystonejs/storage.js)&nbsp;[![Dependency Status](https://gemnasium.com/keystonejs/storage.js.svg)](https://gemnasium.com/keystonejs/storage.js)
==========

Storage.js is a NodeJS library that standardizes common available via `npm` libraries like `pkgcloud` and abstracts away differences (especially within callbacks). Just write a simple implementation and leave configuration up to your users.

* Available storage providers:
	* Rackspace - `Storage.Providers.Rackspace`
	* Amazon - `Storage.Providers.AmazonS3`
	* Azure - `Storage.Providers.Azure`
	* Openshift - `Storage.Providers.Openshift`
	* HP - `Storage.Providers.HP`
	* Local disk - `Storage.Providers.LocalSystem`
	* MongoDB - `Storage.Providers.MongoDB`

* To be included soon:
	* Dropbox, Google Drive
	* You tell me :)

* After initial release
	* (S)FTP - due to lack of nice, up-to-date modules, this is for now on hold.

> More providers will be added upon community requests (feel free to create an issue).

## Installation

*Note: Work in progress*.

```js
var Storage = require('storage.js');
```

## Configuration

Before you start, you have to configure available providers by doing one of the following.

### Global init

Should be called only once during your script execution as every object passed here overwrites previously set config.

```js
Storage.init({
	cloudProvider: {
		provider: Storage.Providers.AmazonS3,
		container: '',
		key: '',
		keyId: ''
	},
	localProvider: {
		provider: Storage.Providers.LocalSystem,
		container: '/var/www/tmp'
	}
});
```

### Separate init

Can be called as many times as you find it useful. Simply extends your config with new providers.

```js
Storage.add('cloudProvider', {
	provider: Storage.Providers.AmazonS3
	container: '',
	key: '',
	keyId: ''
});
```

## Usage

### Uploading

```js
Storage.get('cloudProvider', function (err, client) {
	if (err) return;
	client.upload('/path/to/your/file', '/remote/path', function (err, result) {
        // do your job
    });
});

```
Result object we receive on successful callback looks like the following one:

```js
{
	container: '',
	path: '',
	filename: '',
	url: ''
}
```

Although that object is the same across all of the providers, please read provider-specific docs for better explanation of properties.

### Removing

```js
Storage.get('cloudProvider', function (err, client) {
	if (err) return;
	client.remove('/remote/path', function (err) {
		// do your job
	});
});
```

### Downloading

```js
Storage.get('cloudProvider', function (err, client) {
	if (err) return;
	client.download('/remote/path', '/local/path', function (err) {
		// do your job
	});
});
```

## Hooks

You can hook either before or after one of the following methods: `upload`, `download`, `remove`.

### Usage

Your method passed to a hook will be called with the following arguments:
* `next` method to call on end. If error is passed, other hooks and entire method will be skipped,
* list of the method arguments.

For further information on how hooks work - visit [`hook.js`](https://github.com/bnoguchi/hooks-js) repository.

### Global hooks

Useful if you need a global hook for every provider.

```js
Storage.pre('upload', function (next, localSrc) {
	next();
});
```

### Local hooks

To define a local hook, you can either do it globally or after receiving instance of your client.

```js
Storage.pre('yourProviderName', 'upload', function (next) {
	next();
});
Storage.get('yourProviderName', function (err, client) {
	client.pre('upload', function (next) {
		next();
	});
	// do your upload
});
```

## Motivation

If you ever wanted to implement storage integration right in your application - we got you covered. You've probably encountered problems with different libraries, especially if you wanted to integrate two or three providers, just to give your users a better choice. That's why `Storage.js` was created. Wrapping multiple libraries and creating simple abstraction layer for them allows you to easily add about 5 providers at once!

## API Reference

Will be published soon with better docs as well.

## Testing

With our ~~100%~~ 70% (still improving!) code coverage, we believe it's important. You can run our test suites by a command `npm test`. To generate code coverage, use `gulp coverage`.

## About us

Author: [@grabbou](https://github.com/grabbou) via [KeystoneJS](https://github.com/KeystoneJS)

## Thanks

Special thanks to maintainers of:
- [`pkgcloud`](https://github.com/pkgcloud/pkgcloud) for providing cloud integrations for Azure, HP, Rackspace, OpenShift and Amazon,
- [`gridfs-stream`](https://github.com/aheckmann/gridfs-stream) for MongoDB layer,
- [`hook-js`](https://github.com/bnoguchi/hooks-js) for providing powerful and super easy hook library.

## License

Project licensed under MIT (*See LICENSE for further details*)
