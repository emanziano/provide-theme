import Test from './Test';
import TestItem from './TestItem';

export default {
  dark: false,

  font: {
    google: {
      families: [ 'Droid Sans Mono' ]
    }
  },

  globalStyles: {
    'html, body': {
      height: '100%',
      fontFamily: 'Droid Sans Mono'
    }
  },
  
  styles: {
    Test,
    TestItem
  }
};
