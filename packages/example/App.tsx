import React, {FC} from 'react';
import {Col, Row} from 'jsxstyle';
import {Link, Route, Switch} from 'react-router-dom';

import Home from './Home';
import Test from './Test';

const App: FC = () => {
  return (
    <Col>
      <Row justifyContent="space-evenly">
        <Link to="/">Home</Link>

        <Link to="/test">Test</Link>
      </Row>

      <Switch>
        <Route path="/" exact component={Home} />

        <Route path="/*" component={Test} />
      </Switch>
    </Col>
  );
};

export default App;
