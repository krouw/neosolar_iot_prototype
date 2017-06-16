import mongoose from 'mongoose'
import User from '../models/user'

export const validateUser = (id) => {

  let errors = {}

  if(!mongoose.Types.ObjectId.isValid(id)){
    errors.id = 'Campo Inválido.';
  }

  return new Promise((resolve, reject) => {
    if(isEmpty(errors)){
      User.findById(id)
        .then((user) => {
          if(user){
            resolve({
              user: user,
              isValid: true
            })
          }
          else {
            reject({
              errors: 'Not found',
              isValid: false
            })
          }
        })
        .catch((err) => {
          reject({
            errors: 'server',
            isValid: false
          })
        })
    }
    else {
      reject({
        error: errors,
        isValid: false
      })
    }
  })

}
