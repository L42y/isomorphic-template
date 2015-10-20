'use strict';

import React from 'react';
import {Route, IndexRoute} from 'react-router';

const App = ({...props}) => {
  return (
    <div>
      {props.children}
    </div>
  );
};

const Hello = ({...props}) => {
  return (
    <div>Hello, World!</div>
  );
};

const routes = (
  <Route path="/"
         component={App}>
    <IndexRoute component={Hello}/>
  </Route>
);

export default routes;
