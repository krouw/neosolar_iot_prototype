import React, { Component } from 'react'
import { Scene, Router, Actions, ActionsConst } from 'react-native-router-flux'
import Tutorial from './Tutorial/Tutorial'

class RouterApp extends Component {

  render() {
    return (
      <Router>
        <Scene
          key="tutorial"
          initial={true}
          component={Tutorial}
          hideNavBar={true} />
      </Router>
    )
  }

}

export default RouterApp
