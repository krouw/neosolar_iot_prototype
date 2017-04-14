import React from 'react';
import { connect } from 'react-redux'
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux'
import { styles } from '../styles';
import Tutorial from './Tutorial/Tutorial'
import Signin from './Signin/Signin'
import DeviceList from './DeviceList/DeviceList'

import { STORAGE_KEY_TOKEN, GetStorage } from '../util/AsyncStorage'
import setAuthorizationToken from '../util/setAuthorizationToken'
import jwtDecode from 'jwt-decode'
import { setCurrentUser } from '../actions/auth'

async function existsToken(dispatch){
  const token = await GetStorage(STORAGE_KEY_TOKEN);
  if(token){
    setAuthorizationToken(token);
    const user = jwtDecode(token.split(' ')[1]);
    dispatch(setCurrentUser(user._doc))
    Actions.main({type: ActionConst.RESET})
  }
  else{
    console.log('No hay token');
  }
}

const NavigatorComponent = ({dispatch}) => {
  const handlers = existsToken(dispatch)
  return (
    <Router>
      <Scene key="tutorial" component={Tutorial} hideNavBar={true} />
      <Scene key="signin" component={Signin} hideNavBar={true} />
      <Scene key="main" hideNavBar={true}>
        <Scene key="devicelist" component={DeviceList} />
      </Scene>
    </Router>
  );
}

export default connect()(NavigatorComponent)
