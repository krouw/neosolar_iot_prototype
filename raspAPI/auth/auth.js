import axios from 'axios'
import { SERVER } from '../config/config'

let ACCESS_TOKEN = ''
let REFRESH_TOKEN = ''

export const auth = (body) => {
  return axios.post(`${SERVER}/auth/device`, body)
          .then((res) => {
            const token = res.data.token
            const refreshToken = res.data.refreshToken
            setAuthorizationToken(token, refreshToken)
            return res
          })
}

export const setAuthorizationToken = (token, refreshToken) => {
  if(token){
    axios.defaults.headers.common['Authorization'] = token;
    ACCESS_TOKEN = token
    REFRESH_TOKEN = refreshToken
  }
  else{
    delete axios.defaults.headers.common['Authorization'];
    ACCESS_TOKEN = ''
    REFRESH_TOKEN = ''
  }
}

export const getAuthorizationToken = () => {
  return {
    refreshToken: REFRESH_TOKEN,
    token: ACCESS_TOKEN
  }
}
