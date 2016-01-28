import thunk from 'redux-thunk';
import { canUseDOM } from 'exenv';

export const SET_THEMES = 'SET_THEMES';
export const SET_THEMES_FILES = 'SET_THEMES_FILES';
export const INIT_THEME = 'INIT_THEME';
export const LOAD_THEME = 'LOAD_THEME';

const getPathname = (href) => {
  try {
    return new URL(href).pathname;
  } catch (error) {
    return error;
  }
};

const actions = {
  setThemes(themes) {
    return { type: SET_THEMES, themes };
  },

  setThemesFiles(themesFiles) {
    return { type: SET_THEMES_FILES, themesFiles };
  },

  initTheme(themeName, themeFiles, theme) {
    const { jsFile, cssFile } = themeFiles;
    let links = null;
    let link = null;
    let scripts = null;
    let script = null;
    let index = -1;
    let href = null;

    if (canUseDOM) {
      links = document.getElementsByTagName('link');
      index = links.length;

      while (--index >= 0) {
        href = links[index].href;
        if (href === cssFile || getPathname(href) === cssFile) {
          link = links[index];
          break;
        }
      }

      scripts = document.getElementsByTagName('script');
      index = scripts.length;

      while (--index >= 0) {
        href = scripts[index].src;
        if (href === jsFile || getPathname(href) === jsFile) {
          script = scripts[index];
          break;
        }
      }
    }

    return { type: INIT_THEME, themeName, theme, link, script };
  },

  loadTheme(themeName, themeFiles) {
    const { jsFile, cssFile } = themeFiles;
    let script = null;
    let link = null;
    let theme = null;

    if (canUseDOM) {
      return dispatch => {
        link = document.createElement('link');
        document.head.appendChild(link);
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssFile;

        script = document.createElement('script');
        document.head.appendChild(script);
        script.type = 'text/javascript';
        script.onload = () => {
          theme = window[themeName].default || window[themeName];
          dispatch({ type: LOAD_THEME, themeName, theme, link, script });
        };
        script.src = jsFile;
      };
    } else {
      return (dispatch, getState) => {
        const { themes } = getState();

        theme = themes && themes[themeName] || null;
        dispatch({ type: LOAD_THEME, themeName, theme, link, script });
      };
    }
  }
};

const reducers = {
  themes(state = {}, action) {
    switch (action.type) {
      case SET_THEMES:
        return action.themes;

      default:
        return state;
    }
  },

  themesFiles(state = {}, action) {
    switch (action.type) {
      case SET_THEMES_FILES:
        return action.themesFiles;

      default:
        return state;
    }
  },

  themeName(state = null, action) {
    switch (action.type) {
      case INIT_THEME:
      case LOAD_THEME:
        return action.themeName;

      default:
        return state;
    }
  },

  theme(state = {}, action) {
    switch (action.type) {
      case INIT_THEME:
      case LOAD_THEME:
        return action.theme || {};

      default:
        return state;
    }
  },

  classes(state = {}, action) {
    switch (action.type) {
      case INIT_THEME:
      case LOAD_THEME:
        return action.theme && action.theme.classes || {};

      default:
        return state;
    }
  },

  images(state = {}, action) {
    switch (action.type) {
      case INIT_THEME:
      case LOAD_THEME:
        return action.theme && action.theme.images || {};

      default:
        return state;
    }
  },

  icons(state = {}, action) {
    switch (action.type) {
      case INIT_THEME:
      case LOAD_THEME:
        return action.theme && action.theme.icons || {};

      default:
        return state;
    }
  },

  link(state = null, action) {
    const { link } = action;

    switch (action.type) {
      case INIT_THEME:
      case LOAD_THEME:
        if (state && state.parentNode && state !== link) {
          state.parentNode.removeChild(state);
        }
        return link || null;

      default:
        return canUseDOM && state instanceof HTMLElement ? state : null;
    }
  },

  script(state = null, action) {
    const { script } = action;

    switch (action.type) {
      case INIT_THEME:
      case LOAD_THEME:
        if (state && state.parentNode && state !== script) {
          state.parentNode.removeChild(state);
        }
        return script || null;

      default:
        return canUseDOM && state instanceof HTMLElement ? state : null;
    }
  }
};

const enhancer = next => (reducer, initialState) => {
  const store = next(reducer, initialState);
  const state = initialState || {};
  const { themes, themesFiles, themeName } = state;
  const theme = state.theme || themes && themes[themeName];
  const themeFiles = themesFiles && themesFiles[themeName];
  let initAction = null;

  if (theme || themeFiles) {
    initAction = theme && actions.initTheme(themeName, themeFiles, theme);

    if (initAction && (!canUseDOM || initAction.link && initAction.script)) {
      store.dispatch(initAction);
    } else if (canUseDOM) {
      actions.loadTheme(themeName, themeFiles)(store.dispatch);
    } else {
      store.dispatch(actions.loadTheme(themeName, themeFiles));
    }
  }

  return store;
};

const middleware = thunk;

export default { actions, reducers, enhancer, middleware };
