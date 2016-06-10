import thunk from 'redux-thunk';
import { canUseDOM } from 'exenv';

export const SET_THEMES = 'SET_THEMES';
export const SET_THEMES_FILES = 'SET_THEMES_FILES';
export const INIT_THEME = 'INIT_THEME';
export const LOAD_THEME = 'LOAD_THEME';

function getPathname(href) {
  try {
    return new URL(href).pathname;
  } catch (error) {
    return error;
  }
}

function findElementByPathname(tagName, urlAttr, file) {
  const elements = document.getElementsByTagName(tagName);
  let index = elements.length;
  let url = null;

  while (--index >= 0) {
    url = elements[index][urlAttr];

    if (url === file || getPathname(url) === file) {
      return elements[index];
    }
  }

  return null;
}

function findLink(cssFile) {
  return findElementByPathname('link', 'href', cssFile);
}

function findScript(jsFile) {
  return findElementByPathname('script', 'src', jsFile);
}

const actions = {
  setThemes(themes) {
    return { type: SET_THEMES, themes };
  },

  setThemesFiles(themesFiles) {
    return { type: SET_THEMES_FILES, themesFiles };
  },

  initTheme(themeName, themeFiles, theme) {
    const { jsFile, cssFile } = themeFiles;
    let link = null;
    let script = null;

    if (canUseDOM) {
      link = findLink(cssFile);
      script = findScript(jsFile);
    }

    return { type: INIT_THEME, themeName, theme, themeFiles, link, script };
  },

  loadTheme(themeName, themeFiles, theme) {
    const { jsFile, cssFile } = themeFiles;
    let script = null;
    let link = null;

    if (canUseDOM) {
      return dispatch => {
        link = document.createElement('link');
        document.head.appendChild(link);
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = cssFile;

        script = findScript(jsFile);

        if (theme && script) {
          dispatch({
            type: LOAD_THEME, themeName, theme, themeFiles, link, script
          });
        } else if (script) {
          theme = window[themeName].default || window[themeName];
          dispatch({
            type: LOAD_THEME, themeName, theme, themeFiles, link, script
          });
        } else {
          script = document.createElement('script');
          document.head.appendChild(script);
          script.type = 'text/javascript';
          script.onload = () => {
            theme = window[themeName].default || window[themeName];
            dispatch({
              type: LOAD_THEME, themeName, theme, themeFiles, link, script
            });
          };
          script.src = jsFile;
        }
      };
    } else {
      return (dispatch, getState) => {
        const { themes } = getState();

        theme = themes && themes[themeName] || null;
        dispatch({
          type: LOAD_THEME, themeName, theme, themeFiles, link, script
        });
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

  themeFiles(state = null, action) {
    switch (action.type) {
      case INIT_THEME:
      case LOAD_THEME:
        return action.themeFiles;

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
        return canUseDOM && state instanceof window.HTMLElement ? state : null;
    }
  },

  script(state = null, action) {
    const { script } = action;

    switch (action.type) {
      case INIT_THEME:
      case LOAD_THEME:
        return script || null;

      default:
        return canUseDOM && state instanceof window.HTMLElement ? state : null;
    }
  }
};

const enhancer = next => (reducer, initialState, enhancer) => {
  const store = next(reducer, initialState, enhancer);
  let currentThemeName = null;

  function setTheme(state) {
    const { themes, themesFiles, themeName } = state;
    const theme = themes && themes[themeName] || state.theme;
    const themeFiles = themesFiles && themesFiles[themeName];
    let initAction = null;

    currentThemeName = themeName;

    if (theme || themeFiles) {
      initAction = theme && actions.initTheme(themeName, themeFiles, theme);

      if (initAction && (!canUseDOM || initAction.link && initAction.script)) {
        store.dispatch(initAction);
      } else if (canUseDOM) {
        actions.loadTheme(themeName, themeFiles, theme)(store.dispatch);
      } else {
        store.dispatch(actions.loadTheme(themeName, themeFiles, theme));
      }
    }
  }

  setTheme(initialState || {});

  store.subscribe(() => {
    const nextState = store.getState();

    if (nextState.themeName !== currentThemeName) {
      setTheme(nextState);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    if (canUseDOM) {
      window.themeReloaders.push((reloadedThemeName, theme) => {
        const { themeName, themeFiles } = store.getState();

        if (themeName === reloadedThemeName) {
          actions.loadTheme(themeName, themeFiles, theme)(store.dispatch);
        }
      });
    }
  }

  return store;
};

const middleware = thunk;

const replication = {
  reducerKeys: ['themeName'],
  queryable: true
};

const clientStateKeys = [
  'themeName',
  'theme',
  'themesFiles'
];

export default {
  actions, reducers, enhancer, middleware, replication, clientStateKeys
};

if (canUseDOM && !window.themeReloaders) {
  window.themeReloaders = [];
}

export function reloadTheme(themeName, theme) {
  window.themeReloaders.forEach(reloadTheme => reloadTheme(themeName, theme));
}
