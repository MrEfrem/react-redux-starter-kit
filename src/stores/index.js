import { compose, createStore, applyMiddleware } from 'redux';
import { devTools } from 'redux-devtools';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

let createStoreWithMiddleware;
if (__DEV__) {
  let middlewares;
  if (__CLIENT__) {
    const loggerMiddleware = createLogger();
    middlewares = applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    );
  } else {
    middlewares = applyMiddleware(
      thunkMiddleware
    );
  }

  if (__DEBUG__) {
    createStoreWithMiddleware = compose(
      middlewares,
      devTools()
    )(createStore);
  } else {
    createStoreWithMiddleware = middlewares(createStore);
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
