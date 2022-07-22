import './styles/index.scss'

import React from 'react'
import { render } from 'react-dom'
import App from './containers/App'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import history from './utils/history'
import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from 'reducers'
import createSagaMiddleware from 'redux-saga'
import rootSaga from 'sagas'

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)))

sagaMiddleware.run(rootSaga)

render(
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
)
