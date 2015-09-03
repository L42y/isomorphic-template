'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const Inert = require('inert');
const React = require('react');
const Router = require('react-router');

import routes from './routes.js';

let server = new Hapi.Server({
  connections: {
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    },
    routes: {
      files: {
        relativeTo: __dirname
      }
    }
  }
});

const OOPS = 'Oops, something went wrong.';
const TEMPLATE = fs.readFileSync('./index.html', {encoding: 'utf8'});

server.register(Inert, (err) => {
  if (err) {
    console.log('Failed to load module `inert`');
  } else {
    server.connection({
      host: '0.0.0.0',
      port: process.env.PORT || 4444
    });

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

    server.start((err) => {
      console.log('server started at: ' + server.info.uri);
    });
  }
});
