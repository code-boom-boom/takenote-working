import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import './styles/index.scss'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import history from './utils/history'
import { applyMiddleware, compose, createStore } from 'redux'
import rootReducer from 'reducers'
import createSagaMiddleware from 'redux-saga'
import { logger } from './helpers'
import rootSaga from 'sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(logger, sagaMiddleware),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  )
)

sagaMiddleware.run(rootSaga)

render(
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
)
