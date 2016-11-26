import React from 'react';
import Sortable from 'react-anything-sortable';


export default class DemoHOCItem extends React.Component {
  render() {
    return (
      <div {...this.props}>
        {this.props.children}
      </div>
    );
  }
}
