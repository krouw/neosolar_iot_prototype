import React, { Component } from 'react'
import { View, Text } from 'react-native'

//Store
import { Provider } from 'react-redux'
import store from './store/configureStore'

//SplashScreen
import SplashScreen from 'react-native-splash-screen'
import TimerMixin from 'react-timer-mixin'
import reactMixin from 'react-mixin'

//Modules
import RouterApp from './containers/Router'

class App extends Component {

  componentDidMount() {
    this.setTimeout( () => {
      SplashScreen.hide()
    }, 1000)
  }

  render() {
    return (
      <Provider store={store}>
        <RouterApp />
      </Provider>
    )
  }

}

reactMixin.onClass(App, TimerMixin)
export default App
