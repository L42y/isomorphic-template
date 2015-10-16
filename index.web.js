'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import routes from './routes.js';

let history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>{routes}</Router>,
  document.getElementById('react-root')
);
