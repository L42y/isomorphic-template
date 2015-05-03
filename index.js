'use strict';

let fs = require('fs');
let Hapi = require('hapi');
let React = require('react');
let Router = require('react-router');
let routes = require('./routes');

let server = new Hapi.Server({
  connections: {
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    }
  }
});

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 4444
});

const OOPS = 'Oops, something went wrong.';
const TEMPLATE = fs.readFileSync('./index.html', {encoding: 'utf8'});

server.route([{
  path: '/{params*}',
  method: 'GET',
  handler: function(request, reply) {
    Router.run(routes, request.path, function(Handler) {
      let markup = React.renderToString(<Handler/>);

      return reply(TEMPLATE.replace(OOPS, markup));
    });
  }
}, {
  path: '/favicon.ico',
  method: 'GET',
  handler: {
    file: {
      path: 'public/favicon.ico'
    }
  }
}, {
  path: '/_/{param*}',
  method: 'GET',
  handler: {
    directory: {
      path: 'public'
    }
  }
}, {
  path: '/!/{param*}',
  method: 'GET',
  handler: {
    directory: {
      path: 'tmp'
    }
  }
}]);

server.start(function() {
  console.log('server started at: ' + server.info.uri);
});
