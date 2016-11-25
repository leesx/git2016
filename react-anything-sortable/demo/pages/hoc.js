import React from 'react';
import Sortable from '../../src/';
import DemoHOCItem from '../components/DemoHOCItem.js';

export default class HOC extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleSort(data) {
    this.setState({
      result: data.join(' ')
    });
  }

  render() {
    return (
      <div className="demo-container">
        <h4 className="demo-title">
          Using decorators
          <a href="https://github.com/jasonslyvia/react-anything-sortable/tree/master/demo/pages/hoc.js" target="_blank">source</a>
        </h4>
        <p className="sort-result">result: {this.state.result}</p>
        <Sortable onSort={::this.handleSort} className="style-for-test">
          <DemoHOCItem className="item-1" sortData="react" key={1}>
            React
          </DemoHOCItem>
          <DemoHOCItem className="item-2" sortData="angular" key={2}>
            Angular
          </DemoHOCItem>
          <DemoHOCItem className="item-3" sortData="backbone" key={3}>
            Backbone
          </DemoHOCItem>
        </Sortable>
      </div>
    );
  }
}
