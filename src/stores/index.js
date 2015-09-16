import { compose, createStore, applyMiddleware } from 'redux';
import { devTools } from 'redux-devtools';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';

let createStoreWithMiddleware;
if (__DEV__) {
  if (__DEBUG__) {
    createStoreWithMiddleware = compose(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      ),
      devTools()
    )(createStore);
  } else {
    createStoreWithMiddleware = applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )(createStore);
  }
}
if (__PROD__) {
  createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
  )(createStore);
}

export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (__DEV__ && module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
