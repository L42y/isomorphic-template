import React from 'react';
import {hydrate} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {ApolloProvider} from '@apollo/react-common';

import App from './App';
import {webClient} from './apollo';

hydrate(
  <BrowserRouter>
    <ApolloProvider client={webClient}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
