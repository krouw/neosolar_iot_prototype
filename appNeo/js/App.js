import React, { Component } from 'react'

import SplashScreen from 'react-native-splash-screen'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'

import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import { createLogger } from 'redux-logger'

import NavigatorComponent from './containers/'

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

export default class App extends Component {

  componentDidMount() {
      this.setTimeout(() => {
        SplashScreen.hide();
      }, 1000)
  }

  render() {

    return (
      <Provider store={store}>
        <NavigatorComponent />
      </Provider>
    );
  }
}

reactMixin.onClass(App, TimerMixin)
