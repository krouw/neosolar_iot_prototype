import mongoose from 'mongoose'
import isEmpty from 'lodash/isEmpty'
import Device from '../models/device'

export const validateDevice= (id) => {

  let errors = {}

  if(!mongoose.Types.ObjectId.isValid(id)){
    errors.id = 'Campo Inválido.';
  }

  return new Promise((resolve, reject) => {
    if(isEmpty(errors)){
      Device.findById(id)
        .then((device) => {
          if(device){
            resolve({
              device: device,
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
