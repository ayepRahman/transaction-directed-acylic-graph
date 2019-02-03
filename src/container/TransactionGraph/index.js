import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Button } from 'react-bootstrap';

import dream from 'dreamjs';

import Cytoscape from 'cytoscape';
import CytoscapeDagre from 'cytoscape-dagre';
import CytoscapeComponent from 'react-cytoscapejs';

Cytoscape.use(CytoscapeDagre);

const elements = [
  { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
  { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
  { data: { id: 'three', label: 'Node 3' }, position: { x: 0, y: 0 } },
  { data: { id: 'four', label: 'Node 4' }, position: { x: 100, y: 0 } },

  { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
  // { data: { source: 'two', target: ['two', 'three'], label: 'Edge from Node1 to Node2' } },
  // { data: { source: 'three', target: 'four', label: 'Edge from Node1 to Node2' } },
];

/* <CytoscapeComponent
  elements={CytoscapeComponent.normalizeElements({
    nodes: [
      { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
      { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
    ],
    edges: [
      {
        data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' },
      },
    ],
  })}
/>; */

export class TransactionGraph extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      elements: null,
    };
  }

  generateRandomJson() {
    dream.schema('Nodes', {
      id: String,
      label: String,
    });

    dream.schema('Edges', {
      source: String,
      target: String,
    });

    var nodes = dream.useSchema('Nodes').output();
    var edges = dream.useSchema('Edges').output();

    console.log(nodes);
    console.log(edges);

    this.setState({
      elements: {
        nodes,
        edges,
      },
    });
  }

  render() {
    const { ...others } = this.props;

    return (
      <Fragment>
        <div className="text-center">
          <Button onClick={this.generateRandomJson}>Generate Random Nodes</Button>
        </div>

        {this.state.elements && (
          <div className="border border-dark">
            <CytoscapeComponent
              elements={CytoscapeComponent.normalizeElements(this.state.elements)}
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
    name: 'dagre',
  },
};

// var defaults = {
//   // dagre algo options, uses default value on undefined
//   nodeSep: undefined, // the separation between adjacent nodes in the same rank
//   edgeSep: undefined, // the separation between adjacent edges in the same rank
//   rankSep: undefined, // the separation between adjacent nodes in the same rank
//   rankDir: undefined, // 'TB' for top to bottom flow, 'LR' for left to right,
//   ranker: undefined, // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
//   minLen: function( edge ){ return 1; }, // number of ranks to keep between the source and target of the edge
//   edgeWeight: function( edge ){ return 1; }, // higher weight edges are generally made shorter and straighter than lower weight edges

//   // general layout options
//   fit: true, // whether to fit to viewport
//   padding: 30, // fit padding
//   spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
//   nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
//   animate: false, // whether to transition the node positions
//   animateFilter: function( node, i ){ return true; }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
//   animationDuration: 500, // duration of animation in ms if enabled
//   animationEasing: undefined, // easing of animation if enabled
//   boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//   transform: function( node, pos ){ return pos; }, // a function that applies a transform to the final node position
//   ready: function(){}, // on layoutready
//   stop: function(){} // on layoutstop
// };

export default TransactionGraph;
