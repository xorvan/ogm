// test bootstrap

var Promise = require('bluebird'),
    path = require('path');

Promise.longStackTraces();

global.expect = require('chai').expect;


global.LIB_ROOT = path.resolve(__dirname, 'src');

global.LIB = require(LIB_ROOT);


global.TEST_SERVER = new LIB.connect({
  host: 'orient',
  port: process.env.ORIENT_PORT_2424_TCP_PORT || '2424',
  username: 'root',
  password: process.env.ORIENTDB_ROOT_PASSWORD,
  transport: 'binary'
});

// Uncomment the following lines to enable debug logging
// global.TEST_SERVER.logger.debug = console.log.bind(console, '[ORIENTDB]');


global.CREATE_TEST_DB = createTestDb.bind(null, TEST_SERVER);
global.DELETE_TEST_DB = deleteTestDb.bind(null, TEST_SERVER);

function createTestDb(server, context, name, type) {
  type = type || 'memory';
  return server.exists(name, type)
  .then(function (exists) {
    if (exists) {
      return server.drop({
        name: name,
        storage: type
      });
    }
    else {
      return false;
    }
  })
  .then(function () {
    return server.create({
      name: name,
      type: 'graph',
      storage: type
    });
  })
  .then(function (db) {
     context.db = db;
     global.LIB.session.db = db;
     return undefined;
  });
}

function deleteTestDb (server, name, type) {
  type = type || 'memory';
  return server.exists(name, type)
  .then(function (exists) {
    if (exists) {
      return server.drop({
        name: name,
        storage: type
      });
    }
    else {
      return undefined;
    }
  })
  .then(function () {
    return undefined;
  });
}
