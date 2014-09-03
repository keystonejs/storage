Storage.js [![Travis-Ci](https://travis-ci.org/keystonejs/storage.js.svg)](https://travis-ci.org/keystonejs/storage.js)&nbsp;[![Code Climate](https://codeclimate.com/github/keystonejs/storage.js/badges/gpa.svg)](https://codeclimate.com/github/keystonejs/storage.js)&nbsp;[![Test Coverage](https://codeclimate.com/github/keystonejs/storage.js/badges/coverage.svg?v=2)](https://codeclimate.com/github/keystonejs/storage.js)&nbsp;[![Dependency Status](https://gemnasium.com/keystonejs/storage.js.svg)](https://gemnasium.com/keystonejs/storage.js)
==========

Storage.js is a NodeJS library that standardizes common available via `npm` libraries like `pkgcloud` and abstracts away differences (especially within callbacks). Just write a simple implementation and leave configuration up to your users.

**Table of Contents**

- [Storage.js](#user-content-storagejs-)
	- [Installation](#user-content-installation)
	- [Configuration](#user-content-configuration)
		- [Available storage providers](#user-content-available-providers)
		- [Global init](#user-content-global-init)
		- [Separate init](#user-content-separate-init)
	- [Usage](#user-content-usage)
		- [Uploading](#user-content-uploading)
		- [Removing](#user-content-removing)
		- [Downloading](#user-content-downloading)
	- [Hooks](#user-content-hooks)
		- [Global hooks](#user-content-global-hooks)
		- [Local hooks](#user-content-local-hooks)
		- [Handling errors](#user-content-handling-errors)
		- [Modifying parameters](#user-content-modifying-parameters)
	- [Graceful exits](#user-graceful-exits)
	- [Motivation](#user-content-motivation)
	- [API Reference](#user-content-api-reference)
	- [Testing](#user-content-testing)
	- [About us](#user-content-about-us)
	- [Thanks](#user-content-thanks)
	- [License](#user-content-license)

## Installation

*Note: Work in progress*.

```js
var Storage = require('storage.js');
```

## Configuration

Before you start, you have to configure available providers by doing one of the following.

### Available providers

| Provider | Javascript name | Library | Status |
| -------- | --------------- | ------- | ------ |
| Azure | `Storage.Providers.Azure` | `pkgcloud` | working |
| Amazon | `Storage.Providers.AmazonS3` | `pkgcloud` | working |
| OpenShift | `Storage.Providers.Openshift` | `pkgcloud` | working |
| Rackspace | `Storage.Providers.Rackspace` | `pkgcloud` | working |
| HP | `Storage.Providers.HP` | `pkgcloud` | working |
| Local | `Storage.Providers.LocalSystem` | own, based on `fs` | working |
| MongoDB | `Storage.Providers.MongoDB` | `gfs-grid` | working |
| Dropbox | | | planned |
| Google Drive |  | | planned |

> More providers will be added upon community requests (feel free to create an issue).

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

Following `pre`/`post` hooks are available:
- `upload`,
- `download`,
- `remove`.

To register your hook, you can do it either globally (for every provider) or locally (per provider).

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

### Handling errors

When defining a hook function, you have an access to a few parameters that we pass to every `pre` / `post` method.

The first one is `next` function that, when invoked, fires next hook or entire method.

It accepts optional `Error` object that may:
- inside `pre` - stop firing next hooks / original method and return that error as a result of method call
```js
Storage
	.pre('amazon', 'upload', function (next) {
		next(new Error('Hook!'));
	})
	.pre('upload', function (next) {
		next(new Error('This one is skipped!'));
	});
	.get('amazon', function (err, client) {
		client.upload('file1.txt', 'file2.txt', function (err) {
			console.log(err); //Hook!
		});
	});
```
- inside `post` - stop firing next hooks and return that error as a result of method (original result object of method call will be lost)
```js
Storage
	.post('amazon', 'upload', function (next) {
		next(new Error('Hook!'));
	})
	.post('upload', function (next) {
		next(new Error('This one is skipped!'));
	});
	.post('amazon', function (err, client) {
		client.upload('file1.txt', 'file2.txt', function (err) {
			console.log(err); //Hook! (but method was invoked anyway!)
		});
	});
```

### Modifying parameters

After `next` function described above, the rest of the arguments is simply a list of original method parameters.

So, it's possible to write a hook like below:
```js
Storage.post('amazon', 'upload', function (next, localSrc, destSrc, callback) {
	next('here we pass modified Src');
	// or next(localSrc, 'here we modify destSrc');
	// and so on...
});
```
Please note that we pass `localSrc` parameter to `next`, so other hooks and original method will used that value instead.

For further information on how hooks work and what are another ways of handling errors and modifying parameters - visit [`hook.js`](https://github.com/bnoguchi/hooks-js) repository.

## Graceful exits

In order to clean up resources used by the StorageAPI (for example opened connections to the MongoDB), `Storage` exposes method, called `exit` that you can use like below:

```js
process.on('exit', function () {
	Storage.exit(function () {
		console.log('Exited');
	});
});
```

## Motivation

If you ever wanted to implement storage integration right in your application - we got you covered. You've probably encountered problems with different libraries, especially if you wanted to integrate two or three providers, just to give your users a better choice. That's why `Storage.js` was created. Wrapping multiple libraries and creating simple abstraction layer for them allows you to easily add about 5 providers at once!

## Testing

With our ~~100%~~ 70% (still improving!) code coverage, we believe it's important. You can run our test suites by a command `npm test`. To generate code coverage, use `gulp coverage`.

## About us

Author: [@grabbou](https://github.com/grabbou) via [KeystoneJS](https://github.com/KeystoneJS)

## Thanks

Special thanks to the maintainers of:
- [`pkgcloud`](https://github.com/pkgcloud/pkgcloud) for providing cloud integration with Azure, HP, Rackspace, OpenShift and Amazon,
- [`gridfs-stream`](https://github.com/aheckmann/gridfs-stream) for MongoDB layer,
- [`hook-js`](https://github.com/bnoguchi/hooks-js) for providing powerful and super easy hook library.

## License

Project licensed under MIT (*See LICENSE for further details*)
