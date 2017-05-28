import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose'
import User from '../models/user';
import Device from '../models/device'
import bcrypt from 'bcrypt'
import { ROLE_ADMIN } from '../config/roles'

const validateUser = (data, db) => {
    let errors = {};

    if(isEmpty(data.email)){
      errors.email = 'Campo Requerido'
    }
    else{
      if(!validator.isEmail(data.email)){
        errors.email = 'Email inválido'
      }
    }

    if (isEmpty(data.password)) {
      errors.password = 'Campo Requerido'
    }
    else if (data.password.length<6 || data.password.length>20 ) {
      errors.password = 'Contraseña de 6 a 20 caracteres'
    }

    if(db){
      //Retorno una funcion (Promise) y recibo resultado
      return User.findOne({ 'email' : data.email })
        .then( user => {
          if(user){
            errors.email = 'Este email está siendo utilizado por un usuario'
          }
          return {
            errors,
            isValid: isEmpty(errors)
          }
        })
        .catch((err) => {
          errrors.server = 'Problemas con el servidor'
          return {
            errors,
            isValid: isEmpty(errors)
          }
        })
    }
    else{
      //Retorno un objeto
      return {
        errors,
        isValid: isEmpty(errors)
      }
    }
}

const validateUserUpdate = (data, user, id_update) => {
  let errors = {};
  let result = {};

  if(!mongoose.Types.ObjectId.isValid(id_update)){
    errors.id = 'Campo Inválido.';
  }

  if(isEmpty(data)){
    errors.fields = 'Ingrese al menos un campo.'
  }

  if(!isEmpty(data.name)){
    result.name = data.name
  }

  //Validación para Cambiar el Rol de usuario
  if(!isEmpty(data.role) && (user.role === ROLE_ADMIN)){
    result.role = data.role
  }

  if(!isEmpty(data.password)){
    if (data.password.length<6 || data.password.length>20 ){
      errors.password = 'Contraseña de 6 a 20 caracteres'
    }
  }

  return new Promise( (resolve, reject) => {
      if(isEmpty(errors)){
        if(data.password){
          bcrypt.genSalt(10, function(err, salt){
            if (err) {
              return reject({
                errors: { password: 'Lo Sentimos, no hemos podido responder tu solicitud' }
              })
            }
            bcrypt.hash(data.password, salt, function(err,hash){
              if (err) {
                return reject({
                  errors: { password: 'Lo Sentimos, no hemos podido responder tu solicitud' }
                })
              }
              result.password = hash;
              return resolve({
                update: result
              })
            });
          });
        }
        else{
          return resolve({
            update: result
          })
        }
      }
      else{
        return reject({
          errors: errors,
        })
      }
  })

}

const validateGoogle = (data) => {
  let errors = {};

  if(isEmpty(data.email)){
    errors.email = 'Campo Requerido'
  }
  else{
    if(!validator.isEmail(data.email)){
      errors.email = 'Email inválido'
    }
  }

  if(isEmpty(data.id)){
    errors.id = 'Campo Requerido'
  }

  if(isEmpty(data.idToken)){
    errors.idToken = 'Campo Requerido'
  }

  return validateByGoole(errors, data)
          .then(({errors, isValid, userid}) => {
            return {
              errors: errors,
              isValid: isEmpty(errors),
              userid: userid,
            }
          })
}

const validateUserDevice = (data, id_update) =>{
  let errors = {};

  if(isEmpty(data)){
    errors.fields = 'Ingrese al menos un campo.'
  }

  if(!mongoose.Types.ObjectId.isValid(id_update)){
    errors.id_user = 'Campo Inválido.';
  }

  if(isEmpty(data.id)){
    errors.id_device = 'Campo Requerido';
  }
  else if(!mongoose.Types.ObjectId.isValid(data.id)){
    errors.id_device = 'Campo Inválido.'
  }

  if(isEmpty(data.password)){
    errors.password = 'Campo Requerido';
  }
  else if (data.password.length<6 || data.password.length>20 ) {
    errors.password = 'Contraseña de 6 a 20 caracteres'
  }

  return new Promise( (resolve, reject) => {
      if(isEmpty(errors)){
        Device.findById(data.id)
          .then((device) => {
            if(device){
              bcrypt.compare(data.password, device.password)
              .then((validatePassword) => {
                if(validatePassword == false){
                  errors.password = 'Contraseña Erronea.'
                  return reject({
                    errors: errors,
                  })
                }
                else{
                  return resolve({
                    device: device
                  })
                }
              })
            }
            else{
              errors.device = 'Este recurso no Existe.'
              return reject({
                errors: errors,
              })
            }
          })
      }
      else{
        return reject({
          errors: errors,
        })
      }
  })
}

const validateUserDevDelete = (data) => {
  let errors = {}

  if(!mongoose.Types.ObjectId.isValid(data.idUser)){
    errors.id_user = 'Campo Inválido.';
  }

  if(!mongoose.Types.ObjectId.isValid(data.idDevice)){
      errors.id_device = 'Campo Inválido';
  }

  return new Promise( (resolve, reject) => {
    if(isEmpty(errors)){
      User.findById(data.idUser)
        .then( user => {
          if(user){
            let isDevice = false;
            const newDevices = user.devices.filter( device => {
                let aux = device.toString()
                if(aux !== data.idDevice){
                  return true
                }
                else{
                  isDevice = true;
                  return false;
                }
            })
            if(isDevice){
              return resolve({
                newDevices: newDevices
              })
            }
            else{

              errors.device = 'Este recurso no Existe.'
              return reject({
                errors: errors,
                status: 404,
              })
            }
          }
          else{
            errors.user = 'Este recurso no Existe.'
            return reject({
              errors: errors,
              status: 404,
            })
          }
        })
        .catch((err) => {
          errors.server = 'Lo Sentimos, no hemos podido responder tu solicitud'
          return reject({
            errors: errors,
            status: 500,
          })
        })

    }
    else{
      return reject({
        errors: errors,
        status: 400,
      })
    }
  })

}


export {
        validateUser,
        validateGoogle,
        validateDevice,
        validateUserUpdate,
        validateUserDevDelete,
        validateUserDevice }
