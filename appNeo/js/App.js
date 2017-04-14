import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import store from './config/store'

import SplashScreen from 'react-native-splash-screen'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'

import NavigatorComponent from './containers/'

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
