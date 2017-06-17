import jwt from 'jsonwebtoken'
import { validateDevice, validateDevicePublish } from './device'
import { validateUser, validateUserSubs } from './user'
import { SECRET } from '../config/config'
import { ROLE_CLIENT, ROLE_MANAGER, ROLE_ADMIN, ROLE_DEVICE } from '../config/roles'


// Accepts the connection if the username and password are valid
const Authenticate = function(client, username, password, cb) {

  const token = password.toString().split(' ')
  jwt.verify(token[1], SECRET.secret, (err, decoded) => {
    if(err) {
      cb(null, false)
    }
    else {
      if(decoded.role === ROLE_DEVICE) {
        validateDevice(decoded.sub)
          .then(({device, isValid}) => {
            client.user = username
            cb(null, isValid)
          })
          .catch(({errors, isValid}) => {
            cb(null, isValid)
          })
      }
      else if ( decoded.role === ROLE_CLIENT ||
                decoded.role === ROLE_MANAGER ||
                decoded.role === ROLE_ADMIN ){

          validateUser(decoded.sub)
            .then(({device, isValid}) => {
              client.user = username
              cb(null, isValid)
            })
            .catch(({errors, isValid}) => {
              console.log(errors);
              cb(null, isValid)
            })
      }
    }
  })

}

// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
const AuthorizePublish = function(client, topic, payload, callback) {
  validateDevicePublish(client.user)
    .then(({device}) => {
      callback(null, client.user == topic.split('/')[1]);
    })
    .catch(({errors}) => {
      callback(errors, false);
    })

}

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
const AuthorizeSubscribe = function(client, topic, cb) {
  validateUserSubs(client.user, topic.split('/')[1])
    .then((value) => {
      cb(null, true)
    })
    .catch(({errors}) => {
      cb(errors, false)
    })
}

export { Authenticate, AuthorizePublish, AuthorizeSubscribe }
