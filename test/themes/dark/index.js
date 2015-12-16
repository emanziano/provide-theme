import Test from './Test';
import TestItem from './TestItem';

export default {
  dark: true,

  font: {
    google: {
      families: [ 'Droid Sans' ]
    }
  },

  globalStyles: {
    'html, body': {
      height: '100%',
      fontFamily: 'Droid Sans'
    }
  },

  styles: {
    Test,
    TestItem
  }
};
