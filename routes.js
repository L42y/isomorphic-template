'use strict';

let React = require('react');
let Router = require('react-router');
let {Route, RouteHandler, DefaultRoute} = Router;

let App = React.createClass({
  render() {
    return (
      <RouteHandler/>
    );
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
  </Route>
);

module.exports = routes;
