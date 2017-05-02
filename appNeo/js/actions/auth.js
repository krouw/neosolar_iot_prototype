import axios from 'axios'
import { SubmissionError, reset } from 'redux-form'
import { Actions, ActionConst } from 'react-native-router-flux'
import { GoogleSignin } from 'react-native-google-signin'
import { SET_CURRENT_USER, api } from './types'
import { InsertStorage,
         DeleteStorage,
         STORAGE_KEY_TOKEN } from '../util/AsyncStorage'
import setAuthorizationToken from '../util/setAuthorizationToken'

export function setCurrentUser(user){
  return {
    type: SET_CURRENT_USER,
    user,
  }
}

export const SigninServer = data => {
  return dispatch => {
    return axios.post( api.uri + '/auth/signin', data)
    .then( res => {
      const token = res.data.token;
      InsertStorage(STORAGE_KEY_TOKEN, token)
      setAuthorizationToken(token)
      Actions.main({type: ActionConst.RESET})
      dispatch(setCurrentUser(res.data.user))
    })
    .catch( err => {
      console.log(err);
      throw new SubmissionError({ _error: 'Problemas con el email y/o contraseña.' })
    })
  }
}

export const SignupServer = data => {
  return dispatch => {
    return axios.post( api.uri + '/auth/signup', data)
      .then( res => {
          console.log(res);
      })
      .catch( err => {
        console.log(err);
      })
  }
}

export const SigninGoogle = () => {
  return dispatch => {
    GoogleSignin.signIn()
    .then( res => {
      console.log(res);
      const { email, id, idToken } = res;
      const data = {
        email: email,
        id: id,
        idToken: idToken,
      }
      return axios.post(`${api.uri}/auth/googlenative`, data)
    })
    .then( res => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }
}


export const Logout = () => {
  return dispatch => {
    dispatch(reset('signin'))
    dispatch(reset('signup'))
    DeleteStorage(STORAGE_KEY_TOKEN)
    setAuthorizationToken(false)
    GoogleSignin.signOut();
    dispatch(setCurrentUser({}))
    Actions.signin({type: ActionConst.RESET});
  }
}
