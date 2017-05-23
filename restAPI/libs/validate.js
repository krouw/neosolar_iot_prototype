import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import User from '../models/user';

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

export { validateUser, validateGoogle, validateDevice }
