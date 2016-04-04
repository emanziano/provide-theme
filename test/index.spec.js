import expect from 'expect';
import React, { PropTypes } from 'react';
import { Simulate } from 'react-addons-test-utils';
import { renderTest } from 'react-redux-provide-test-utils';
import { Test } from './components/index';
import * as providers from './providers/index';
import * as themes from './themes/index';
import themesFiles from './themes/files';

const themeNames = Object.keys(themesFiles);
let themeName = themeNames.shift();
let themeFiles = themesFiles[themeName];
let theme = themes[themeName];

const defaultProps = {
  providers: {
    ...providers,
    theme: {
      ...providers.theme,
      state: {
        themes,
        themesFiles,
        themeFiles,
        themeName,
        theme,
        classes: theme.classes,
      }
    },
    list: {
      ...providers.list,
      state: {
        list: [
          {
            value: 'test'
          }
        ]
      }
    }
  }
};

const test = renderTest(Test, { ...defaultProps });

describe('provide-theme', () => {
  it('should render correctly with initialized dark theme', () => {
    const links = document.getElementsByTagName('link');
    const link = links[0];
    const scripts = document.getElementsByTagName('script');
    const script = scripts[0];

    expect(links.length).toBe(1);
    expect(link.href).toBe('DarkTheme.css');
    expect(scripts.length).toBe(1);
    expect(script.src).toBe('DarkTheme.js');

    expect(test.node.tagName).toBe('DIV');
    expect(test.node.className).toBe('dark__Test');
    expect(test.node.childNodes.length).toBe(1);
    expect(test.node.childNodes[0].className).toBe('dark__TestItem');
  });

  it('should render correctly upon switching to light theme', () => {
    themeName = themeNames.shift();
    themeFiles = themesFiles[themeName];
    theme = themes[themeName];

    test.wrappedInstance.props.loadTheme(themeName, themeFiles, theme);

    const links = document.getElementsByTagName('link');
    const link = links[0];
    const scripts = document.getElementsByTagName('script');
    const script = scripts[0];

    expect(links.length).toBe(1);
    expect(link.href).toBe('LightTheme.css');
    expect(scripts.length).toBe(1);
    expect(script.src).toBe('LightTheme.js');

    expect(test.node.tagName).toBe('DIV');
    expect(test.node.className).toBe('light__Test');
    expect(test.node.childNodes.length).toBe(1);
    expect(test.node.childNodes[0].className).toBe('light__TestItem');
  });
});
