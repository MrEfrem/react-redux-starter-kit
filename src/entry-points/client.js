import React     from 'react';
import ReactDOM  from 'react-dom';
import configureStore from '../stores';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createRoutes from '../routes';
import { Router }   from 'react-router';
import { fetchComponentData } from '../utils';
import { Provider } from 'react-redux';
import DevToolsView from '../components/DevToolsView';

const target = document.getElementById('root');
const store  = configureStore(window.__INITIAL_STATE__);

function onRouteEnter(nextState, transition, done) {
  fetchComponentData(store.dispatch, nextState.routes.map(route => route.component), nextState.params)
    .catch(err => {
      if (!__PROD__) {
        window.console.log(err);
      }
    });
  done();
}

const node = (
  <div>
    <DevToolsView store={store}/>
    <Provider store={store}>
      <Router history={createBrowserHistory()}>
        {createRoutes(onRouteEnter)}
      </Router>
    </Provider>
  </div>
);
ReactDOM.render(node, target);
