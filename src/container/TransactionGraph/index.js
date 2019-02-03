import React, { Component, Fragment } from 'react';
import autoBind from 'react-autobind';

import dream from 'dreamjs';

import Cytoscape from 'cytoscape';
import CytoscapeDagre from 'cytoscape-dagre';
import CytoscapeComponent from 'react-cytoscapejs';

Cytoscape.use(CytoscapeDagre);

export class TransactionGraph extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      nodes: null,
      edges: null,
    };
  }

  componentDidMount = () => {
    this.generateRandomJson();
    this.generateCalculatedEdges();
  };

  generateCalculatedEdges() {
    const SACRED_NUMBER = 44;

    const edges = [
      { data: { source: 1, target: 2, label: 'edge' } },
      { data: { source: 1, target: 3, label: 'edge' } },
      { data: { source: 1, target: 4, label: 'edge' } },
      { data: { source: 1, target: 5, label: 'edge' } },
    ];

    let newEdges = [];

    for (var i = 0; i < SACRED_NUMBER; i++) {
      const randomNo = Math.floor(Math.random() * 2) + i;

      edges.forEach(ele => {
        console.log('ele', ele);

        const {
          data: { source, target },
        } = ele;

        const obj = {
          data: {
            source: source + randomNo,
            target: target + randomNo,
          },
        };

        newEdges.push(obj);
      });
    }

    this.setState({
      edges: newEdges,
    });
  }

  generateRandomJson() {
    // 1 -> 50
    const randomCriticalTransactionNo = Math.floor(Math.random() * 50) + 1;

    dream.customType('incrementalId', function(helper) {
      return helper.previousItem ? helper.previousItem.data.id + 1 : 1;
    });

    dream.customType('incrementalLabel', function(helper) {
      if (helper.previousItem) {
        if (helper.previousItem.data.id === randomCriticalTransactionNo) {
          return 'CRITICAL TRANSACTION!!!!';
        } else {
          return `Node ${helper.previousItem.data.id + 1}`;
        }
      } else {
        return `Node ${1}`;
      }
    });

    dream.schema('Nodes', {
      data: {
        id: 'incrementalId',
        label: 'incrementalLabel',
      },
    });

    var nodes = dream
      .input({
        name: 'Node',
      })
      .useSchema('Nodes')
      .generateRnd(50)
      .output();

    this.setState({
      nodes,
    });
  }

  render() {
    const { ...others } = this.props;
    const { nodes, edges } = this.state;

    return (
      <Fragment>
        {nodes && edges && (
          <div className="border border-dark">
            <CytoscapeComponent
              elements={CytoscapeComponent.normalizeElements({ nodes, edges })}
              style={{ width: '100%', height: '800px' }}
              {...others}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

TransactionGraph.defaultProps = {
  layout: {
    name: 'dagre', // change to "dagre"
  },
};

export default TransactionGraph;
