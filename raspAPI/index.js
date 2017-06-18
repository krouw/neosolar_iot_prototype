import mqtt from 'mqtt'
import acquisition from './fakeMeter'
import { ID, PASSWORD, SERVER } from './config/config'
import { datastore } from './datastore'
import { auth } from './auth/auth'
import { publish } from './services/mqtt'
import { getAuthorizationToken, setAuthorizationToken } from './util/AuthorizationToken'

const send = (payload) => {
  //datastore(payload)
  publish(payload)
}

const Main = () => {
  auth({ id: ID, password: PASSWORD })
    .then((value) => {
      console.log('==> AUTH');

      setInterval(() => {
        console.log('==> Acquisition');
           acquisition()
            .then(({msm}) => {
              send(msm)
            })
            .catch((err) => {
              console.log('Error acquisition ' + err);
            })
      }, 10000)

    })
    .catch((err) => {
      console.log('Error Auth' + err.response.data);
      setAuthorizationToken()
    })
}

Main()
