import { assignProviders } from 'react-redux-provide';
import theme from '../src/index';
import provideList from 'react-redux-provide-list';
import Test from './components/Test';
import TestItem from './components/TestItem';
import darkTheme from './themes/dark/index';

const list = provideList();
const initialState = {
  theme: darkTheme,
  list: [
    {
      value: 'test'
    }
  ]
};

assignProviders(initialState, { theme, list }, {
  Test,
  TestItem
});
