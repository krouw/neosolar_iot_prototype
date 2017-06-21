import GoogleAuth from 'google-auth-library'
import isEmpty from 'lodash/isEmpty'

const socialAuth  = {
  "googleAuth" : {
    "clientID"      : "36091147132-oeg0ibuusnbi2camkmkv36svrvp43vb7.apps.googleusercontent.com",
    "clientSecret"  : "hlexfH4bDTzDQd0xjI2vTz_v",
    "callbackURL"   : "http://localhost:7000/api/auth/google/close"
    }
}

const validateByGoole = (errors, data) => {

  const promise = new Promise( (resolve, reject) => {

    const auth = new GoogleAuth;
    const client = new auth.OAuth2(socialAuth.clientID, '', '');
    if(!isEmpty(errors)){
      return resolve({
        errors: errors,
        status: 400
      })
    }
    else{
      client.verifyIdToken(data.idToken, socialAuth.clientID, (err, login) => {
        if(err){
          errors._error = 'Problemas de validación con Google'
          return reject({
            errors: errors,
            status: 500
          })
        }
        else {
          const payload = login.getPayload();
          return resolve({
            user: payload
          });
        }

      })
    }
  })
  return promise;
}

export { socialAuth, validateByGoole }
