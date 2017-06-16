import axios from 'axios'
import { setAuthorizationToken } from '../util/AuthorizationToken'
import { SERVER } from '../config/config'

export const auth = (body) => {
  return axios.post(`${SERVER}/auth/device`, body)
          .then((res) => {
            const token = res.data.token
            const refreshToken = res.data.refreshToken
            setAuthorizationToken(token, refreshToken)
            return res
          })
}
