[![Build Status](https://travis-ci.org/Orgun109uk/data-config.svg)](https://travis-ci.org/Orgun109uk/data-config)
[![Build Status](https://david-dm.org/orgun109uk/data-config.png)](https://david-dm.org/orgun109uk/data-config)
[![npm version](https://badge.fury.io/js/data-config.svg)](http://badge.fury.io/js/data-config)

[![NPM](https://nodei.co/npm/data-config.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/data-config/)

# Data/Config

This utility provides a Data and Config class, the Data class allows for the manipulation of a data object using a
dot deliminated path. While the Config class extends the Data class with load and save functionality.

### Installation
```sh
$ npm install data-config
```

### Usage
```js
const Data = require('data-config').Data;

let myData = new Data({
    value1: "hello",
    value2: {
        value3: "world"
    }
});

// > "hello"
console.info(myData.get('value1'));

// > "world"
console.info(myData.get('value2.value3'));

// > null
console.info(myData.get('value3'));

// > "hello world"
console.info(myData.get('value3', 'hello world'));

```

The Data class provides the a *get*, *set*, *del* and *has* methods to get, set, delete and check for properties.

```js
const Data = require('data-config').Data;

// Create the Data object, and use '.' for the deliminator.
let myData = new Data({}, '.');

// > false
myData.has('value1');

// > null
myData.get('value1');

myData.set('value1', 'hello world');

// > true
myData.has('value1');

// > "hello world"
myData.get('value1');

myData.del('value1');

// > false
myData.has('value1');

// > null
myData.get('value1');
```

Setting the data using the Data object also updates the provided data object, for example:

```js
const Data = require('data-config').Data;

let data = {};
let myData = new Data(data);

myData.set('value1.value2', 'hello world');

// > {"value1": {"value2": "hello world"}}
console.dir(data);
```

Finally, you can also create references from a larger data object, which will kepp each other updated:

```js
const Data = require('data-config').Data;

let data = {
    'settings': {
        'module1': {
            'value1': 'hello world'
        },
        'module2': {
            'value1': 'foo bar'
        }
    }
};
let myData = new Data(data);

let ref1 = myData.ref('settings.module1');
let ref2 = myData.ref('settings.module2');

// > "hello world"
console.info(myData.get('settings.module1.value1'));
console.info(ref1.get('value1'));

// > "foo bar"
console.info(myData.get('settings.module2.value1'));
console.info(ref2.get('value1'));

ref1.set('value1', 'foo bar');

// > "foo bar"
console.info(myData.get('settings.module1.value1'));
console.info(ref1.get('value1'));

// > "foo bar"
console.info(myData.get('settings.module2.value1'));
console.info(ref2.get('value1'));

// > {"settings": {"module1": {"value1": "foo bar"}}, "module2": {"value1": "foo bar"}}}
console.dir(data);
```

## Config object

The config object extends from the Data class, but provides the load/loadSync and save/saveSync methods.

```js
const Config = require('data-config').Config;

let config = new Config('path/to/config-file.json');
config.load((err) => {

    config.set('value1', 'hello');

    config.saveSync();

});
```

## Testing
A mocha test suite has been provided and can be run by:
```sh
$ npm test
```