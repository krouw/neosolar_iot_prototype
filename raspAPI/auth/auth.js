import axios from 'axios'
import setAuthorizationToken from '../util/setAuthorizationToken'
import { api } from '../config/config'


export const auth = (body) => {
  return axios.post(`${api}/auth/device`, body)
          .then((res) => {
            const token = res.data.token
            setAuthorizationToken(token)
            return res
          })
}
