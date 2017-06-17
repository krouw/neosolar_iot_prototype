import mongoose from 'mongoose'
import User from '../models/user'
import Device from '../models/device'
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

export const validateUserSubs = (clientId, idTopic) => {

  let errors = {}

  if(!mongoose.Types.ObjectId.isValid(idTopic)){
    errors.topic = 'Campo Inválido.';
  }

  return new Promise( (resolve, reject) => {
      if(isEmpty(errors)){
        Device.findById(idTopic)
          .then((device) => {
            if(device){
              const checkUser = device.users.filter( user => {
                  let aux = user.toString()
                  return aux == clientId
              })
              if(!isEmpty(checkUser)){
                resolve({
                  devices: checkUser,
                })
              }
              else{
                errors.user = 'No tienes permiso para realizar cambios.'
                return reject({
                  errors: errors,
                })
              }
            }
            else{
              errors.device = 'Recurso no Encontrado'
              return reject({
                errors: errors,
              })
            }
          })
          .catch((err) => {
            errors.server = 'Lo Sentimos, no hemos podido responder tu solicitud'
            return reject({
              errors: errors,
            })
          })
      }
      else{
        return reject({
          errors: errors,
        })
      }
  })

}
