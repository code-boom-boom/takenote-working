import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer from '../reducers';
import { logger } from '../helpers';

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(logger),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store