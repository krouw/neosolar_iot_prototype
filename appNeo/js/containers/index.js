import React from 'react';
import { connect } from 'react-redux'
import { Scene, Router, Actions, ActionConst, Modal } from 'react-native-router-flux'
import { styles } from '../styles';
import Tutorial from './Tutorial/Tutorial'
import Signin from './Signin/Signin'
import DeviceList from './DeviceList/DeviceList'
import Profile from './Profile/Profile'
import Device from './Device/Device'
import { GoogleSignin } from 'react-native-google-signin'
import { STORAGE_KEY_TOKEN, GetStorage, InsertStorage } from '../util/AsyncStorage'
import setAuthorizationToken from '../util/setAuthorizationToken'
import jwtDecode from 'jwt-decode'
import { setCurrentUser } from '../actions/auth'

const STORAGE_KEY_TUTORIAL = 'id_tutorial'

async function existsToken(dispatch){
  const token = await GetStorage(STORAGE_KEY_TOKEN);
  if(token){
    setAuthorizationToken(token);
    const data = jwtDecode(token.split(' ')[1]);
    dispatch(setCurrentUser(data.user))
    Actions.main({type: ActionConst.RESET})
  }
  else{
    const tutorial = await GetStorage(STORAGE_KEY_TUTORIAL);
    if(tutorial){
      Actions.signin({type: ActionConst.REPLACE});
    }
    else{
      const persistTutorial = await InsertStorage(STORAGE_KEY_TUTORIAL, 'true');
    }
  }
}

const NavigatorComponent = ({dispatch}) => {
  //const handlers = existsToken(dispatch)
  return (
    <Router>
      <Scene key="tutorial" component={Tutorial} hideNavBar={true} />
      <Scene key="signin" initial={true} component={Signin} hideNavBar={true} />
      <Scene key="main" hideNavBar={true}>
        <Scene
          key="devicelist"
          component={DeviceList} />
        <Scene
          key="profile"
          component={Profile}
          direction={'vertical'} />
        <Scene
          key="device"
          component={Device} />
      </Scene>
    </Router>
  );
}

export default connect()(NavigatorComponent)
