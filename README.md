# provide-theme

[![build status](https://img.shields.io/travis/loggur/provide-theme/master.svg?style=flat-square)](https://travis-ci.org/loggur/provide-theme) [![npm version](https://img.shields.io/npm/v/provide-theme.svg?style=flat-square)](https://www.npmjs.com/package/provide-theme)
[![npm downloads](https://img.shields.io/npm/dm/provide-theme.svg?style=flat-square)](https://www.npmjs.com/package/provide-theme)

Provides themes as classes created by JSS to React components.


## Installation

```
npm install provide-theme --save
```


## Usage

This provides React components with interchangeable themes.  The provided themes should simply be a bundled CSS file and a bundled JS file containing a mapping of the class names (as `classes`), at the very least.  This means you can bundle your themes using plain CSS, inline styles, [`css-modules`](https://github.com/css-modules/css-modules), [`jss`](https://github.com/jsstyles/jss), or any other format of your choosing.  The system behind this provider is designed with code-splitting in mind so that you're only loading the selected theme when you need it.

Your components may be provided the following `actions` as `propTypes`:

- `setThemes (Object themes)` - This should typically only be used server-side.  You probably won't ever need to call this action since your `themes` reducer is typically set via the initial `providedState`.

- `setThemesFiles (Object themesFiles)` - You probably won't ever need to call this action as well, since your `themesFiles` reducer is typically set via the initial `providedState`.  The client uses the `themesFiles` reducer to know which files to load for their selected theme.

- `initTheme (String themeName, Object themeFiles, Object theme)` - This is typically used to initialize the theme before rendering the app so that components can immediately have the the theme's `classes`, `images`, `icons`, etc.  It is automatically called via an `enhancer` when the `store` is created.  On the client, it will find any matching `link` and `script` elements matching the `themeFiles` so that their respective `reducers` may be properly initialized after server-side rendering.

- `loadTheme (String themeName, Object themeFiles)` - This is typically used client-side to load a theme dynamically and is likely the only `action` you'll ever need to call within your components.


Your components may also be provided the following reduced `propTypes`:

- `themes` - An object containing all themes.  You'll probably never need this, and if you do, it is probably best to limit it to the server.

- `themesFiles` - An object containing a mapping of the themes' names to their respective `jsFile` and `cssFile`.  You probably won't use this within your components, as it's mostly used internally for dynamically loading themes on the client.

- `themeFiles` - An object containing the currently selected theme's `jsFile` and `cssFile`.  You probably won't use this within your components, as it's mostly used internally for dynamically loading themes on the client.

- `themeName` - The currently selected theme's name.

- `theme` - This object contains the currently selected theme's properties: `classes`, `images`, `icons`, and any other custom properties you may need.

- `classes` - A mapping of simplified class names to their namespaced versions.  Derived from the `theme` object.  This has its own reducer to minimize the amount of boilerplate required when retrieving your theme's properties within your components.

- `images` - Derived from the `theme` object.  This has its own reducer to minimize the amount of boilerplate required when retrieving your theme's properties within your components.

- `icons` - Derived from the `theme` object.  This has its own reducer to minimize the amount of boilerplate required when retrieving your theme's properties within your components.

- `link` - The current theme's respective `link` element, mostly used internally when dynamically loading themes on the client.  This element gets removed and another put in its place when changing themes.

- `script` - The current theme's respective `script` element, mostly used internally when dynamically loading themes on the client.  This element gets removed and another put in its place when changing themes.


## Quick Example

```js
import React from 'react';
import { render } from 'react-dom';
import { App } from './components/index';
import providers from './providers/index';
import themesFiles from './themes/files';

const themeName = Object.keys(themesFiles).shift();
const themeFiles = themesFiles[themeName];

const props = {
  providers,
  providedState: {
    themesFiles,
    themeFiles,
    themeName
  }
};

render(<App { ...props } />, document.getElementById('root'));
```


## Full Example w/ Server Rendering

See [`bloggur`](https://github.com/loggur/bloggur).  **Protip:**  Remember that you can include images with your theme's bundle and that React can handle `svg` (vector graphics) elements, so it's good practice to use them where possible!
