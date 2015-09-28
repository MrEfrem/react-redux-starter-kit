require('babel/register');

const server = require('../server'),
      config = require('../config');

if (config.get('globals').__DEV__) {
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json)/i
    })) {
    return;
  }
}

const port = config.get('server_port');

server.listen(port);
console.log('Koa server listening on port: ' + port);
