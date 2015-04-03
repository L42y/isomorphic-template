'use strict';

let React = require('react');
let Router = require('react-router');
let routes = require('./routes');

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler/>, document.getElementById('react-root'));
});
