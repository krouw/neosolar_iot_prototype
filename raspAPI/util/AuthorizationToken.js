import axios from 'axios';

let ACCESS_TOKEN = ''
let REFRESH_TOKEN = ''

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
