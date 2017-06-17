import mongoose from 'mongoose'
import User from '../models/user'
import isEmpty from 'lodash/isEmpty'

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
            errors.user = 'Not found'
            reject({
              errors: 'Not found',
              isValid: false
            })
          }
        })
        .catch((err) => {
          errors.server = 'Problemas con mongo'
          reject({
            errors: 'server',
            isValid: false
          })
        })
    }
    else {
      reject({
        errors: errors,
        isValid: false
      })
    }
  })

}
