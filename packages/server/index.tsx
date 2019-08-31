import {join} from 'path';
import React, {ComponentType} from 'react';
import {Server, ServerOptions} from '@hapi/hapi';
import Inert from '@hapi/inert';
import ApolloClient from 'apollo-client';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import {getDataFromTree} from '@apollo/react-ssr';
import {FilledContext, HelmetProvider} from 'react-helmet-async';
import {ApolloProvider} from '@apollo/react-common';

const isDev = process.env.NODE_ENV === 'development';

interface IServerStartOptions {
  name: string;
  port: number;
  options?: Partial<ServerOptions>;
  manifest: any;
  component: ComponentType;
  onPreStart?: (server: Server) => Promise<void>;
  apolloClient: ApolloClient<any>;
  fileRelativeTo?: string;
}

export const start = async ({
  name,
  port,
  options,
  manifest,
  component: Component,
  onPreStart,
  apolloClient,
  fileRelativeTo = __dirname
}: IServerStartOptions): Promise<void> => {
  const server = new Server({
    port,
    routes: {
      files: {
        relativeTo: fileRelativeTo
      }
    },
    ...options
  });

  const [styles, scripts] = Object.keys(manifest).reduce(
    ([styles, scripts], filename) => {
      if (filename.includes('.css')) {
        return [
          styles.includes(manifest[filename])
            ? styles
            : [...styles, manifest[filename]],
          scripts
        ];
      } else if (filename.includes('.js')) {
        return [
          styles,
          scripts.includes(manifest[filename])
            ? scripts
            : [...scripts, manifest[filename]]
        ];
      } else {
        return [styles, scripts];
      }
    },
    [[], []]
  );

  await server.register(Inert);

  server.route([
    {
      path: '/_/{path*}',
      method: 'GET',
      handler: {
        directory: {
          path: join(__dirname, `../${name}`, isDev ? 'tmp' : 'dist')
        }
      }
    },
    {
      path: '/{path*}',
      method: 'GET',
      async handler(request) {
        const helmetContext = {};
        const routerContext = {};

        const app = (
          <StaticRouter
            context={routerContext}
            location={request.url.pathname + request.url.search}>
            <ApolloProvider client={apolloClient}>
              <HelmetProvider context={helmetContext}>
                <Component />
              </HelmetProvider>
            </ApolloProvider>
          </StaticRouter>
        );

        try {
          await getDataFromTree(app);
        } catch (error) {
          console.error(error);
        }
        const core = renderToString(app);
        const {helmet} = helmetContext as FilledContext;
        const initialState = apolloClient.extract();

        const html = renderToStaticMarkup(
          <html {...helmet.htmlAttributes.toComponent()}>
            <head>
              <meta charSet="utf-8" />
              {helmet.title.toComponent()}
              <meta
                name="viewport"
                content="width=device-width,minimum-scale=1,initial-scale=1"
              />
              {helmet.meta.toComponent()}
              {helmet.link.toComponent()}
              {styles.map(href => (
                <link key={href} rel="stylesheet" href={href} />
              ))}
            </head>

            <body {...helmet.bodyAttributes.toComponent()}>
              <div id="root" dangerouslySetInnerHTML={{__html: core}} />

              <script
                dangerouslySetInnerHTML={{
                  __html: `window.__APOLLO_STATE__=${JSON.stringify(
                    initialState
                  ).replace(/</g, '\\u003c')};`
                }}
              />
              {scripts.map(src => (
                <script key={src} src={src} />
              ))}
            </body>
          </html>
        );

        return `<!doctype html>${html}`;
      }
    }
  ]);

  if (onPreStart) {
    await onPreStart(server);
  }

  await server.start();

  console.info(`Server started at ${server.info.uri}: ${name}`);
};
