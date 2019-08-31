import React, {FC} from 'react';
import {Col} from 'jsxstyle';
import gql from 'graphql-tag';
import {Helmet} from 'react-helmet-async';
import {useQuery} from '@apollo/react-hooks';

const CURRENT_USER_QUERY = gql`
  query {
    github {
      user(username: "L42y") {
        login
      }
    }
  }
`;

const Home: FC = () => {
  const {data} = useQuery(CURRENT_USER_QUERY);

  return data ? (
    <Col>
      <Col>Hi, {data.github.user.login}</Col>

      <Helmet>
        <title>Home</title>
      </Helmet>
    </Col>
  ) : null;
};

export default Home;
