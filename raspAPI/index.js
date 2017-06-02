import acquisition from './hioki'
import axios from 'axios'
import setAuthorizationToken from './setAuthorizationToken'
import { id, password, api } from './config'
import { persist } from './persist'

const data = {
  id: id,
  password: password,
}
let token = ''

axios.post(`${api}/auth/device`,data)
  .then((res) => {
    token = data.token
    let body = {}
    setAuthorizationToken(token)
    setInterval(() => {
	       acquisition()
          .then((value) => {
            persist(value)
          })
          .catch((err) => {
            console.log(err);
          })
    }, 2000)
  })
  .catch((err) => {
    console.log(err);
  })
