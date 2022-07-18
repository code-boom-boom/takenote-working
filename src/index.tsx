import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import './styles/index.scss';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import history from './utils/history';

render(
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
);