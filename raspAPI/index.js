import acquisition from './Hioki/index'
import axios from 'axios'
import setAuthorizationToken from './util/setAuthorizationToken'
import { id, password, api } from './config/config'
import { persist } from './persist'

const bodyAuth = {
  id: id,
  password: password,
}
let token = ''

axios.post(`${api}/auth/device`,bodyAuth)
  .then((res) => {
    token = res.data.token
    let body = {}
    setAuthorizationToken(token)
    setInterval(() => {
	       acquisition()
          .then(({msm}) => {
            persist(msm)
          })
          .catch((err) => {
            console.log('Error acquisition ' + err.response.data);
          })
    }, 6000)

  })
  .catch((err) => {
    console.log('Error Login ' + err.response.data);
  })
