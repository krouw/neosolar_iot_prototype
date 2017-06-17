import axios from 'axios'
import { ToastAndroid } from 'react-native'
import { SubmissionError, reset } from 'redux-form'
import { Actions, ActionConst } from 'react-native-router-flux'
import { GoogleSignin } from 'react-native-google-signin'
import { SET_CURRENT_USER, SET_TOKEN, api } from './types'
import { setDevices } from './device'
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

export function setToken(token){
  return {
    type: SET_TOKEN,
    token,
  }
}

export const SigninServer = data => {
  return dispatch => {
    return axios.post( `${api.uri}/auth/signin`, data)
      .then( res => {
        const token = res.data.token;
        dispatch(setCurrentUser(res.data.user))
        dispatch(setToken(token))
        //InsertStorage(STORAGE_KEY_TOKEN, token)
        setAuthorizationToken(token)
      })
      .then(() => {
        Actions.main({type: ActionConst.RESET})
      })
      .catch( err => {
        if(!err.response){
          ToastAndroid.show('No se ha podido establecer conexión con el Servidor', ToastAndroid.LONG);
        }
        if(err.response){
          if(err.response.status === 400 || err.response.status === 404 || err.response.status === 403){
            throw new SubmissionError(err.response.data.errors)
          }
          if(err.response.status === 500){
            ToastAndroid.show(err.response.data.errors._error, ToastAndroid.LONG);
          }
        }
      })
  }
}

export const SignupServer = data => {
  return dispatch => {
    return axios.post( `${api.uri}/auth/signup`, data)
      .then( res => {
        const token = res.data.token;
        dispatch(setCurrentUser(res.data.user))
        dispatch(setToken(token))
        //InsertStorage(STORAGE_KEY_TOKEN, token)
        setAuthorizationToken(token)
      })
      .then(() => {
        Actions.main({type: ActionConst.RESET})
      })
      .catch( err => {
        console.log(err.response);
        if(!err.response){
          ToastAndroid.show('No se ha podido establecer conexión con el Servidor', ToastAndroid.LONG);
        }
        if(err.response){
          if(err.response.status === 400){
            throw new SubmissionError(err.response.data.errors)
          }
        }
      })
  }
}

export const SigninGoogle = () => {
  return dispatch => {
    GoogleSignin.signIn()
    .then( res => {
      const { email, id, idToken } = res;
      const data = {
        email: email,
        id: id,
        idToken: idToken,
      }
      axios.post(`${api.uri}/auth/googlenative`, data)
        .then( res => {
          const token = res.data.token;
          //InsertStorage(STORAGE_KEY_TOKEN, token)
          setAuthorizationToken(token)
          dispatch(setToken(token))
          Actions.main({type: ActionConst.RESET})
          dispatch(setCurrentUser(res.data.user))
        })
        .catch((err) => {
          let errors = err.response.data.errors;
          if(errors.google){
            ToastAndroid.show(errors.google, ToastAndroid.LONG);
          }
        })
    })
    .catch((err) => {
      if(err){
        ToastAndroid.show('No se ha podido establecer conexión con Google', ToastAndroid.LONG);
      }
    })
    .done();
  }
}


export const Logout = () => {
  return dispatch => {
    //DeleteStorage(STORAGE_KEY_TOKEN)
    setAuthorizationToken(false)
    dispatch(setToken(''))
    GoogleSignin.signOut();
    dispatch(setCurrentUser({}))
    Actions.signin({type: ActionConst.RESET});
  }
}
