import { canUseDOM } from 'exenv';

import jss from 'jss';
import jssExtend from 'jss-extend';
import jssNested from 'jss-nested';
import jssCamelCase from 'jss-camel-case';
import jssPx from 'jss-px';
import jssVendorPrefixer from 'jss-vendor-prefixer';
import jssPropsSort from 'jss-props-sort';

jss.use(jssExtend());
jss.use(jssNested());
jss.use(jssCamelCase());
jss.use(jssPx());
if (canUseDOM) {
  jss.use(jssVendorPrefixer());
}
jss.use(jssPropsSort());

export const SET_THEME = 'SET_THEME';

const actions = {
  setTheme(theme) {
    return { type: SET_THEME, theme };
  }
};

const reducers = {
  theme(state = {}, action) {
    switch (action.type) {
      case SET_THEME:
        return action.theme;

      default:
        return state;
    }
  },

  globalSheet(state = null, action) {
    switch (action.type) {
      case SET_THEME:
        const { globalStyles } = action.theme;

        if (state) {
          state.detach();
        }

        return globalStyles
          ? jss.createStyleSheet(globalStyles, { named: false }).attach()
          : null;

      default:
        return state;
    }
  },

  sheet(state = null, action) {
    switch (action.type) {
      case SET_THEME:
        const { styles } = action.theme;

        if (state) {
          state.detach();
        }

        return styles
          ? jss.createStyleSheet(styles).attach()
          : null;

      default:
        return state;
    }
  }
};

function merge (stateProps, dispatchProps, parentProps) {
  return {
    ...parentProps,
    classes: stateProps.sheet && stateProps.sheet.classes
  };
}

const enhancer = next => (reducer, initialState) => {
  const store = next(reducer, initialState);

  if (initialState && initialState.theme) {
    store.dispatch(actions.setTheme(initialState.theme));
  }

  return store;
};

export default { actions, reducers, merge, enhancer };
