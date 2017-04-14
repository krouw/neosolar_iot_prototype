import React, { Component } from 'react';
import { Navigator } from 'react-native'

import { styles } from '../styles';
import Tutorial from './Tutorial/Tutorial'
import Signin from './Signin/Signin'

const ROUTES = {
  tutorial: Tutorial,
  signin: Signin,
};

export default class NavigatorComponent extends Component {

  constructor(){
    super();
  }

  renderScene(route, navigator){
    const Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  }

  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{name: 'tutorial'}}
        renderScene={this.renderScene}
        configureScene={() => { return Navigator.SceneConfigs.FloatFromRight }}
      />
    );
  }
}
