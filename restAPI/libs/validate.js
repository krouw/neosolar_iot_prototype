import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose'
import User from '../models/user';
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
    errors.update = 'Ingrese al menos un campo.'
  }

  if(!isEmpty(data.name)){
    result.name = data.name
  }

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

const validateDevice = (data) =>{
  let errors = {};

  if(isEmpty(data.id)){
    errors.id = 'Campo Requerido';
  }

  if(isEmpty(data.password)){
    errors.password = 'Campo Requerido';
  }
  else if (data.password.length<6 || data.password.length>20 ) {
    errors.password = 'Contraseña de 6 a 20 caracteres'
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  }
}

export { validateUser, validateGoogle, validateDevice, validateUserUpdate }
