import React, { Component, PropTypes } from 'react';

export default class TestItem extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  };

  render() {
    return (
      <li className={this.props.classes.TestItem}>
        {this.props.item.value}
      </li>
    );
  }
}
