import acquisition from './hioki'
import axios from 'axios'
import setAuthorizationToken from './setAuthorizationToken'
import { id, password, api } from './config'
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
            //console.log(msm);
            persist(msm)
          })
          .catch((err) => {
            console.log(err.response.data);
          })
    }, 2000)
  })
  .catch((err) => {
    console.log(err.response.data);
  })
