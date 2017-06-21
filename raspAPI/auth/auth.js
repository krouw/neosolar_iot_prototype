import axios from 'axios'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { SERVER } from '../config/config'

let ACCESS_TOKEN = ''

export const auth = (body) => {
  return axios.post(`${SERVER}/auth/device`, body)
          .then((res) => {
            const token = res.data.token
            const refreshToken = res.data.refreshToken
            setAuthorizationToken(token, refreshToken)
            return res
          })
}

export const setAuthorizationToken = (token) => {
  if(token){
    axios.defaults.headers.common['Authorization'] = token;
    ACCESS_TOKEN = token
  }
  else{
    delete axios.defaults.headers.common['Authorization'];
    ACCESS_TOKEN = ''
  }
}

export const getAuthorizationToken = () => {
  return {
    token: ACCESS_TOKEN
  }
}

export const checkToken = (next) => {
  const Authorization = getAuthorizationToken()
  if(Authorization.token){
    const decoded = jwt.decode(Authorization.token.split(' ')[1])

    if (decoded.exp && (moment.unix(decoded.exp) - moment(Date.now()) < 5000)) {
      auth({ id: ID, password: PASSWORD })
        .then((value) => {
          setAuthorizationToken(value.data.token)
          next()
        })
        .catch((err) => {
          setAuthorizationToken()
          next(err)
        })
    }
    else {
      next()
    }
  }
}
