'use strict';

import React from 'react';
import {Route, DefaultRoute} from 'react-router';

const App = ({...props}) => {
  return (
    <div>
      {props.children}
    </div>
  );
};

const routes = (
  <Route path="/"
         component={App}>
  </Route>
);

export default routes;
