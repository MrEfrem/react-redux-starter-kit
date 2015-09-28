import fs        from 'fs';
import config    from '../../config';
import React     from 'react';
import ReactDOM  from 'react-dom/server';
import serialize from 'serialize-javascript';
import { RoutingContext } from 'react-router';
import { Provider } from 'react-redux';
import { DevTools, LogMonitor, DebugPanel } from 'redux-devtools/lib/react';

const paths = config.get('utils_paths');
const { DevToolsView, route, configureStore, fetchComponentData } = require(paths.dist('server'));

const globals = config.get('globals');

// ------------------------------------
// Rendering Setup
// ------------------------------------
// TODO: there's a cleaner way to do this. The reason we're using the
// compiled .html file is so that we don't have to worry about query strings
// on generated assets, and we maintain a consistent index.html file between
// client-side development w/ webpack-dev-server and server rendering.
const getTemplate = (function () {
  const renderTemplate = () => {
    return fs.readFileSync(paths.dist('client/index.html'), 'utf-8')
      .replace(
      '<div id="root"></div>',
      [
        '<div id="root">${content}</div>',
        '<script>window.__INITIAL_STATE__ = ${initialState}</script>'
      ].join('')
    );
  };
  if (globals.__DEV__) {
    return () => renderTemplate();
  } else {
    const renderedTemplate = renderTemplate();
    return () => renderedTemplate;
  }
})();

// TODO: should probably use a tagged template
function renderIntoTemplate (template, content, initialState) {
  return template
    .replace('${content}', content)
    .replace('${initialState}', serialize(initialState));
}

// ------------------------------------
// Rendering Middleware
// ------------------------------------
export default function *renderRouteMiddleware (next) {
  const props  = yield route(this.request.url);

  let store = configureStore();

  yield fetchComponentData(store.dispatch, props.components, props.params);

  //Reset state for redux-devtools after performing fetchComponentData, because in client side store state initializing
  //trough preload state from server.
  if (globals.__DEBUG__) {
    store = configureStore(store.getState());
  }

  const markup = ReactDOM.renderToString(
    <div>
      <DevToolsView store={store}/>
      <Provider store={store}>
        <RoutingContext {...props} />
      </Provider>
    </div>
  );

  this.body = renderIntoTemplate(getTemplate(), markup, store.getState());
}
