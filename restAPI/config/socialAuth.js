import GoogleAuth from 'google-auth-library'

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
        errors,
        isValid: isEmpty(errors)
      })
    }
    else{
      client.verifyIdToken(data.idToken, socialAuth.clientID, (err, login) => {
        let errors = {}
        if(err){
          errors.google = 'Problemas de validación con Google'
          return resolve({
            errors,
            isValid: isEmpty(errors)
          })
        }
        const payload = login.getPayload();
        return resolve({
          userid: {id: payload['sub']},
          isValid: isEmpty(errors),
          errors,
        });
      })
    }
  })
  return promise;
}

export { socialAuth, validateByGoole } 
