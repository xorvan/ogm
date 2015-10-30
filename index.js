var fs = require('fs');

if (fs.existsSync(__dirname + '/src')) {
  module.exports = require('./src')
} else {
  module.exports = require('./lib')
}
