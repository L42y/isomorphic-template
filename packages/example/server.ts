import {start} from 'server';

import App from './App';
import {serverClient} from './apollo';

start({
  name: 'example',
  port: 4000,
  manifest: require('./tmp/manifest.json'),
  component: App,
  apolloClient: serverClient
});
