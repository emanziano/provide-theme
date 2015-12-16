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
jss.use(jssVendorPrefixer());
jss.use(jssPropsSort());

const SET_THEME = 'SET_THEME';

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

  classes(state = {}, action) {
    switch (action.type) {
      case SET_THEME:
        return jss.createStyleSheet(action.theme.styles).attach().classes;

      default:
        return state;
    }
  }
};

const enhancer = next => (reducer, initialState) => {
  const store = next(reducer, initialState);

  store.dispatch(actions.setTheme(initialState.theme));

  return store;
};

export default { actions, reducers, enhancer };

