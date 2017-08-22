import mqtt from 'mqtt'
import acquisition from './sensors/fakeMeter'
import { ID, PASSWORD, SERVER } from './config/config'
import { http } from './services/http'
import { auth, getAuthorizationToken, setAuthorizationToken, checkToken } from './auth/auth'
import { publish } from './services/mqtt'

const send = (payload) => {
  //datastore(payload)
  publish(payload)
}

const loopAdquisiction() => {
  setInterval(() => {
    checkToken((err) => {
      if (err) {
        console.log('Error token', err);
      }
      else {
        acquisition()
         .then(({msm}) => {
           send(msm)
         })
         .catch((err) => {
           console.log('Error acquisition ' + err);
         })
      }
    })
  }, 10000)
}

const Main = () => {
  auth({ id: ID, password: PASSWORD })
    .then((value) => {
      console.log('==> AUTH');
      setAuthorizationToken(value.data.token)
      loopAdquisiction()

    })
    .catch((err) => {
      console.log('Error Auth' + err.response.data);
      setAuthorizationToken()
    })
}

Main()
