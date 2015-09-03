'use strict';

const React = require('react');
const Router = require('react-router');
const {Route, RouteHandler, DefaultRoute} = Router;

const App = React.createClass({
  render() {
    return (
      <RouteHandler/>
    );
  }
});

const routes = (
  <Route name="app" path="/" handler={App}>
  </Route>
);

export default routes;
