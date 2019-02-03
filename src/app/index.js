import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import TransactionGraph from 'container/TransactionGraph';

import './index.css';

class App extends Component {
  render() {
    return (
      <Container>
        <Row className=" py-3 text-center">
          <Col xs={12}>
            <h3>Transaction Directed Acylic Graph</h3>
          </Col>
        </Row>

        <Row>
          <Col className="px-0" xs={12}>
            <TransactionGraph />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
