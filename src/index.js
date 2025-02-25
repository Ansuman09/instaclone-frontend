import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import postReducer from './features/Posts';
import subsReducer from './features/Subscriptions';
import notificationReducer from './features/Notifications';
import userInfoReducer from './features/Userinfo';

const store = configureStore({
  reducer:{
    posts:postReducer,
    subs:subsReducer,
    notifications:notificationReducer,
    users:userInfoReducer
  },
});

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
