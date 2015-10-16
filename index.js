'use strict';

import fs from 'fs';
import {Server} from 'hapi';
import {badImplementation, notFound} from 'boom';
import Inert from 'inert';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RoutingContext} from 'react-router';

import routes from './routes.js';

let server = new Server({
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

server.route({
  path: '/{params*}',
  method: 'GET',
  handler: function(request, reply) {
    match({routes, location: request.url.href}, (error, redirectLocation, renderProps) => {
      if (error) {
        return reply(badImplementation(error.message));
      } else if (redirectLocation) {
        return reply.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        const markup = renderToString(<RoutingContext {...renderProps}/>);

        return reply(TEMPLATE.replace(OOPS, markup));
      } else {
        return reply(notFound());
      }
    });
  }
});

const OOPS = 'Oops, something went wrong.';
const TEMPLATE = fs.readFileSync('./index.html', {encoding: 'utf8'});

server.register(Inert, (err) => {
  if (err) {
    console.log('Failed to load module `inert`');
  } else {
    server.route([{
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
