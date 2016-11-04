'use strict';

import React from 'react';
import {Link, Route, IndexRoute} from 'react-router';

const App = ({children}) => {
  return (
    <div>
      {children}
    </div>
  );
};

const Hello = () => {
  return (
    <div>
      Hello, <Link to="/world">World!</Link>
    </div>
  );
};

const World = () => {
  return (
    <div>Hola</div>
  );
};

const routes = (
  <Route path="/"
         component={App}>
    <IndexRoute component={Hello}/>
    <Route path="world"
           component={World}/>
  </Route>
);

export default routes;
