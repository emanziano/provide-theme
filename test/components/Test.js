import React, { Component, PropTypes } from 'react';
import TestItem from './TestItem';

export default class Test extends Component {
  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    loadTheme: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className={this.props.classes.Test}>
        {this.renderItems()}
      </div>
    );
  }

  renderItems() {
    return this.props.list.map(
      (item, index) => <TestItem key={index} index={index} />
    );
  }
}
