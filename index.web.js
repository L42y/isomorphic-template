'use strict';

const React = require('react');
const Router = require('react-router');

import routes from './routes.js';

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler/>, document.getElementById('react-root'));
});
