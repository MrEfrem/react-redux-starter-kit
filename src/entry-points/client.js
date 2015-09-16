import React     from 'react';
import ReactDOM  from 'react-dom';
import Root      from '../containers/Root';
import configureStore from '../stores';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createRoutes from '../routes';
import { Router }   from 'react-router';
import { fetchComponentData } from '../utils';

const target = document.getElementById('root');
const store  = configureStore(window.__INITIAL_STATE__);

// Note how we fill the next route on route leave.
// We don't waste time re-fetching when we're hydrated from server.
function onRouteEnter(nextState, transition, done) {
  fetchComponentData(store.dispatch, nextState.routes.map(b => b.component), nextState.params)
    .catch(err => {
      if (!__PROD__) {
        window.console.log(err);
      }
    });
  done();
}

const node = (
  <Root store={store}>
    <Router history={createBrowserHistory()}>
      {createRoutes(onRouteEnter)}
    </Router>
  </Root>
);
ReactDOM.render(node, target);
