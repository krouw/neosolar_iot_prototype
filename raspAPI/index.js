import mqtt from 'mqtt'
import acquisition from './sensors/fakeMeter'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { ID, PASSWORD, SERVER } from './config/config'
import { datastore } from './datastore'
import { auth, getAuthorizationToken, setAuthorizationToken } from './auth/auth'
import { publish } from './services/mqtt'

const send = (payload) => {
  //datastore(payload)
  publish(payload)
}

const checkToken = (next) => {
  const Authorization = getAuthorizationToken()
  if(Authorization.token){
    const decoded = jwt.decode(Authorization.token.split(' ')[1])

    if (decoded.exp && (moment.unix(decoded.exp) - moment(Date.now()) < 5000)) {
      auth({ id: ID, password: PASSWORD })
        .then((value) => {
          next()
        })
        .catch((err) => {
          setAuthorizationToken()
          next(err)
        })
    }
    else {
      console.log('token no caducado');
      next()
    }
  }
}

const Main = () => {
  auth({ id: ID, password: PASSWORD })
    .then((value) => {
      console.log('==> AUTH');
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

    })
    .catch((err) => {
      console.log('Error Auth' + err.response.data);
      setAuthorizationToken()
    })
}

Main()
