import './init';
import expect from 'expect';
import React, { PropTypes } from 'react';
import { Simulate } from 'react-addons-test-utils';
import { renderTest } from 'react-redux-provide-test-utils';
import Test from './components/Test';
import TestItem from './components/TestItem';
import darkTheme from './themes/dark/index';
import lightTheme from './themes/light/index';

const test = renderTest(Test);
const testItem = renderTest(TestItem, { index: 0 });

function getBgColor(node) {
  const computedStyle = window.getComputedStyle(node, null);
  return computedStyle.getPropertyValue('background-color');
}

function getColor(node) {
  const computedStyle = window.getComputedStyle(node, null);
  return computedStyle.getPropertyValue('color');
}

describe('react-redux-provide-theme', () => {
  it('should render correctly with initialized dark theme', () => {
    expect(test.node.tagName).toBe('DIV');
    expect(test.node.childNodes.length).toBe(1);

    expect(getBgColor(test.node)).toBe('rgb(0, 0, 0)');
    expect(getColor(test.node)).toBe('rgb(255, 255, 255)');

    expect(getBgColor(test.node.childNodes[0])).toBe('rgb(51, 51, 51)');
    expect(getColor(test.node.childNodes[0])).toBe('rgb(221, 221, 221)');
    expect(getBgColor(testItem.node)).toBe('rgb(51, 51, 51)');
    expect(getColor(testItem.node)).toBe('rgb(221, 221, 221)');
  });

  it('should render correctly upon switching to light theme', () => {
    test.wrappedInstance.props.setTheme(lightTheme);

    expect(test.node.tagName).toBe('DIV');
    expect(test.node.childNodes.length).toBe(1);

    expect(getBgColor(test.node)).toBe('rgb(255, 255, 255)');
    expect(getColor(test.node)).toBe('rgb(0, 0, 0)');

    expect(getBgColor(test.node.childNodes[0])).toBe('rgb(221, 221, 221)');
    expect(getColor(test.node.childNodes[0])).toBe('rgb(51, 51, 51)');
    expect(getBgColor(testItem.node)).toBe('rgb(221, 221, 221)');
    expect(getColor(testItem.node)).toBe('rgb(51, 51, 51)');
  });
});
