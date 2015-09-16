require('babel/register');

module.exports = exports = [
  require('./build/webpack/client-dev'),
  require('./build/webpack/server')
];
