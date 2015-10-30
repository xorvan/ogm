# OrientJS OGM for Node.JS
Simple Object Graph Mapper based on ES6 classes and using ES7 decorators.

# Installation

Install via npm.

```sh
npm install ogm
```

# Running Tests

To run the test suite, first invoke the following command within the repo, installing the development dependencies:

```sh
npm install
```

Then run the tests:

```sh
npm test
```

# Features

- Using official OrientDB driver for node.js [orientjs](https://github.com/orientechnologies/orientjs).
- Intuitive API, based on next gen javascript.

# Usage

### Configuring the client.

```js
import * as ogm from 'ogm';

var server = ogm.connect({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'yourpassword'
});
```


### Using an existing database

```js
var db = ogm.use('mydb');
console.log('Using database: ' + db.name);
```

### Using an existing database with credentials

```js
var db = ogm.use({
  name: 'mydb',
  username: 'admin',
  password: 'admin'
});
console.log('Using database: ' + db.name);
```

### Defining simple model

```js
@ogm.model("Person")
class Person extends ogm.V {

  @ogm.property(String)
  name = this.name;

  @ogm.property(Number)
  age = this.age;
}
```

### Create, Edit, Save and Delete from model

```js
var john = new Person({name: 'John'});

// Saving new instance
await john.save();

// Editing properties
john.age = 12;

//Saving changes
await john.save();

//Deleting instance
await john.delete();

```

### Query model

```js
var john = await Person.query({name: 'John'}).one();

// Getting by rid
var john = await Person.get('#1:1');


```
