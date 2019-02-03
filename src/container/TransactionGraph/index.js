import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Button } from 'react-bootstrap';

import dream from 'dreamjs';

import Cytoscape from 'cytoscape';
import CytoscapeDagre from 'cytoscape-dagre';
import CytoscapeComponent from 'react-cytoscapejs';

Cytoscape.use(CytoscapeDagre);

// const elements = [
//   { data: { id: 'one', label: 'Node 1' }, position: { x: 0, y: 0 } },
//   { data: { id: 'two', label: 'Node 2' }, position: { x: 100, y: 0 } },
//   { data: { id: 'three', label: 'Node 3' }, position: { x: 0, y: 0 } },
//   { data: { id: 'four', label: 'Node 4' }, position: { x: 100, y: 0 } },

//   { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
//   { data: { source: 'one', target: 'three', label: 'Edge from Node1 to Node2' } },
//   { data: { source: 'one', target: 'four', label: 'Edge from Node1 to Node2' } },
//   // { data: { source: 'two', target: ['two', 'three'], label: 'Edge from Node1 to Node2' } },
//   // { data: { source: 'three', target: 'four', label: 'Edge from Node1 to Node2' } },
// ];

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

// const edges = [
//   { data: { source: 1, target: 2, label: 'edge' } },
//   { data: { source: 1, target: 3, label: 'edge' } },
//   { data: { source: 1, target: 4, label: 'edge' } },
//   { data: { source: 2, target: 3, label: 'edge' } },
//   { data: { source: 2, target: 4, label: 'edge' } },
//   { data: { source: 2, target: 5, label: 'edge' } },
//   { data: { source: 3, target: 4, label: 'edge' } },
//   { data: { source: 3, target: 5, label: 'edge' } },
//   { data: { source: 3, target: 6, label: 'edge' } },
// ];

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
    console.log('MY REF', this.cy);

    // 1 -> 50
    const randomCriticalTransactionNo = Math.floor(Math.random() * 50) + 1;

    console.log('randomCriticalTransactionNo', randomCriticalTransactionNo);

    dream.customType('incrementalId', function(helper) {
      return helper.previousItem ? helper.previousItem.data.id + 1 : 1;
    });

    dream.customType('incrementalLabel', function(helper) {
      // console.log(helper);

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

    dream.customType('incrementalSource', function(helper) {
      const { previousItem } = helper;
      console.log('incrementalSource', helper);

      if (helper.previousItem) {
        const {
          data: { source, target },
        } = previousItem;

        console.log('incrementalSource - source', source);
        console.log('incrementalSource - target', target);

        if (source < target) {
          return source + 1;
        } else if (source === target) {
          return source;
        } else {
          return source + 1;
        }
      } else {
        return 1;
      }
    });

    dream.customType('incrementalTarget', function(helper) {
      const { previousItem } = helper;
      console.log('incrementalTarget', helper);

      if (helper.previousItem) {
        const {
          data: { source, target },
        } = previousItem;

        console.log('incrementalTarget - source', source);
        console.log('incrementalTarget - target', target);

        if (target - source === 1) {
          return target + 1;
        } else if (target - source === 2) {
          return target + 2;
        } else {
          return target + 1;
        }
      } else {
        return 2;
      }
    });

    dream.schema('Nodes', {
      data: {
        id: 'incrementalId',
        label: 'incrementalLabel',
      },
    });

    dream.schema('Edges', {
      data: {
        source: 'incrementalSource',
        target: 'incrementalTarget',
      },
    });

    var nodes = dream
      .input({
        name: 'Node',
      })
      .useSchema('Nodes')
      .generateRnd(50)
      .output();
    var edges = dream
      .useSchema('Edges')
      .generateRnd(49)
      .output();

    console.log('nodes', nodes);
    console.log('edges', edges);

    this.setState({
      elements: {
        nodes,
        edges,
      },
    });
  }

  render() {
    const { ...others } = this.props;

    console.log(this.state.elements);
    console.log('OI REF', this.cy);

    return (
      <Fragment>
        <div className="text-center pb-3">
          <Button onClick={this.generateRandomJson}>Generate Random Nodes</Button>
        </div>

        {this.state.elements && (
          <div className="border border-dark">
            <CytoscapeComponent
              cy={cy => {
                return (this.cy = cy);
              }}
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
    name: 'random',
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
