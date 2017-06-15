import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose'
import User from '../models/user';
import Device from '../models/device'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET } from '../config/config'
import { ROLE_ADMIN } from '../config/roles'

const validateUserCreate = (body, user) => {
    let errors = {};
    let result = {};

    if(isEmpty(body.email)){
      errors.email = 'Campo Requerido'
    }
    else{
      if(!validator.isEmail(body.email)){
        errors.email = 'Email inválido'
      }
      else {
        result.email = body.email
      }
    }

    if (isEmpty(body.password)) {
      errors.password = 'Campo Requerido'
    }
    else if (body.password.length<6 || body.password.length>20 ) {
      errors.password = 'Contraseña de 6 a 20 caracteres'
    }
    else {
      result.password = body.password
    }

    if(!isEmpty(body.name)){
      result.name = body.name
    }

    //Validación Rol de usuario
    if(!isEmpty(body.role) && (user.role === ROLE_ADMIN)){
      result.role = body.role
    }

    return new Promise( (resolve, reject) => {
      if(isEmpty(errors)){
        User.findOne({ 'email' : body.email })
          .then( user => {
            if(user){
              errors.email = 'Este email está siendo utilizado por un usuario'
              reject({
                errors: errors,
                status: 400,
              })
            }
            else{
              resolve({
                result: result,
              })
            }
          })
          .catch((err) => {
            errors.server = 'Problemas con el servidor'
            return {
              errors: errors,
              status: 500,
            }
          })
      }
      else{
        reject({
          errors: errors,
          status: 400,
        })
      }
    });
}

const validateUserUpdate = (body, user, params) => {
  let errors = {};
  let result = {};

  if(!mongoose.Types.ObjectId.isValid(params.idUser)){
    errors.id_user = 'Campo Inválido.';
  }

  if(isEmpty(body)){
    errors.fields = 'Ingrese al menos un campo.'
  }

  if(!isEmpty(body.name)){
    result.name = body.name
  }

  //Validación para Cambiar el Rol de usuario
  if(!isEmpty(body.role) && (user.role === ROLE_ADMIN)){
    result.role = body.role
  }

  if(!isEmpty(body.password)){
    if (body.password.length<6 || body.password.length>20 ){
      errors.password = 'Contraseña de 6 a 20 caracteres'
    }
  }

  return new Promise( (resolve, reject) => {
      if(isEmpty(errors)){
        if(body.password){
          bcrypt.genSalt(10, function(err, salt){
            if (err) {
              return reject({
                errors: { password: 'Lo Sentimos, no hemos podido responder tu solicitud' },
                status: 500,
              })
            }
            bcrypt.hash(body.password, salt, function(err,hash){
              if (err) {
                return reject({
                  errors: { password: 'Lo Sentimos, no hemos podido responder tu solicitud' },
                  status: 500,
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
          status: 400,
        })
      }
  })

}

const validateUserDevice = (body, params) =>{
  let errors = {};

  if(isEmpty(body)){
    errors.fields = 'Ingrese al menos un campo.'
  }

  if(!mongoose.Types.ObjectId.isValid(params.idUser)){
    errors.id_user = 'Campo Inválido.';
  }

  if(isEmpty(body.id)){
    errors.id_device = 'Campo Requerido';
  }
  else if(!mongoose.Types.ObjectId.isValid(body.id)){
    errors.id_device = 'Campo Inválido.'
  }

  if(isEmpty(body.password)){
    errors.password = 'Campo Requerido';
  }
  else if (body.password.length<6 || body.password.length>20 ) {
    errors.password = 'Contraseña de 6 a 20 caracteres'
  }

  return new Promise( (resolve, reject) => {
      if(isEmpty(errors)){
        Device.findById(body.id)
          .then((device) => {
            if(device){
              bcrypt.compare(body.password, device.password)
              .then((validatePassword) => {
                if(validatePassword == false){
                  errors.password = 'Contraseña Erronea.'
                  return reject({
                    errors: errors,
                    status: 403,
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
              errors.device = 'Recurso no Encontrado.'
              return reject({
                errors: errors,
                status: 404,
              })
            }
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

const validateUserDeviceUpdate = (params, body) => {
  let errors = {}
  let result = {}

  if(!mongoose.Types.ObjectId.isValid(params.idUser)){
    errors.id_user = 'Campo Inválido.';
  }

  if(!mongoose.Types.ObjectId.isValid(params.idDevice)){
      errors.id_device = 'Campo Inválido';
  }

  if(isEmpty(body)){
    errors.fields = 'Ingrese al menos un campo.'
  }

  if(!isEmpty(body.name)){
    result.name = body.name
  }

  if(!isEmpty(body.coordenadas)){
    result.coordenadas = body.coordenadas
  }

  if(!isEmpty(body.battery)){
    result.battery = body.battery
  }

  if(!isEmpty(body.password)){
    if (body.password.length<6 || body.password.length>20 ){
      errors.password = 'Contraseña de 6 a 20 caracteres'
    }
  }

  return new Promise( (resolve, reject) => {
      if(isEmpty(errors)){
        Device
          .findById(params.idDevice)
          .then((device) => {
            if(device){
              const checkUser = device.users.filter( user => {
                  let aux = user.toString()
                  return aux == params.idUser
              })
              if(!isEmpty(checkUser)){
                if(body.password){
                  bcrypt.genSalt(10, function(err, salt){
                    if (err) {
                      return reject({
                        errors: { password: 'Lo Sentimos, no hemos podido responder tu solicitud' },
                        status: 500
                      })
                    }
                    bcrypt.hash(body.password, salt, function(err,hash){
                      if (err) {
                        return reject({
                          errors: { password: 'Lo Sentimos, no hemos podido responder tu solicitud' },
                          status: 500,
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
                errors.user = 'No tienes permiso para realizar cambios.'
                return reject({
                  errors: errors,
                  status: 403,
                })
              }
            }
            else{
              errors.device = 'Recurso no Encontrado'
              return reject({
                errors: errors,
                status: 404
              })
            }
          })
          .catch((err) => {
            errors.server = 'Lo Sentimos, no hemos podido responder tu solicitud'
            return reject({
              errors: errors,
              status: 500
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

const validateUserDevDelete = (params) => {
  let errors = {}

  if(!mongoose.Types.ObjectId.isValid(params.idUser)){
    errors.id_user = 'Campo Inválido.';
  }

  if(!mongoose.Types.ObjectId.isValid(params.idDevice)){
      errors.id_device = 'Campo Inválido';
  }

  return new Promise( (resolve, reject) => {
    if(isEmpty(errors)){
      User.findById(params.idUser)
        .then( user => {
          if(user){
            let isDevice = undefined;
            const newDevices = user.devices.filter( device => {
                let aux = device.toString()
                if(aux !== params.idDevice){
                  return true
                }
                else{
                  isDevice = device;
                  return false;
                }
            })
            if(isDevice){
              Device.findById(isDevice)
                .then((device) => {
                  const newUsers = device.users.filter( userDev => {
                      let aux = userDev.toString()
                      return aux !== params.idUser;
                  })
                  return resolve({
                    newDevices: newDevices,
                    newUsers: newUsers,
                  })
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

              errors.device = 'Recurso no Encontrado.'
              return reject({
                errors: errors,
                status: 404,
              })
            }
          }
          else{
            errors.user = 'Recurso no Encontrado.'
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

const validateRefreshTokenUser = (body) => {

  let errors = {}

  if(isEmpty(body)){
    errors.fields = 'Ingrese al menos un campo.'
  }

  if(isEmpty(body.id)){
    errors.id = 'Campo Requerido';
  } else if(!mongoose.Types.ObjectId.isValid(body.id)){
    errors.id = 'Campo Inválido.';
  }

  if(isEmpty(body.refreshToken)) {
    errors.refreshToken = 'Campo Requerido'
  }

  return new Promise( (resolve, reject) => {
    if(isEmpty(errors)){

      User.findById(body.id)
        .then((user) => {
          if(user){
            if(user.refreshToken === body.refreshToken){
              const userData = {
                sub: user._id,
                email: user.email,
                role: user.role,
              }
              jwt.sign(userData, SECRET.secret, { expiresIn: 10000 }, (err, token) => {
                if(err){
                  errors._error = 'Problemas con el servidor'
                  reject({
                    errors: errors,
                    status: 500,
                  })
                }
                else {
                  resolve({
                    value: user,
                    token: token
                  })
                }
              });
            }
            else {
              errors.refreshToken = 'Unauthorized'
              reject({
                errors: errors,
                status: 403,
              })
            }
          }
          else {
            errors.user = 'Not Found'
            reject({
              errors: errors,
              status: 404,
            })
          }
        })
        .catch((err) => {
          console.log(err);
          errors._error = 'Problemas con el servidor'
          reject({
            errors: errors,
            status: 500,
          })
        })
    }
    else{
      reject({
        errors: errors,
        status: 401,
      })
    }
  })

}


export { validateUserCreate,
         validateUserUpdate,
         validateUserDevDelete,
         validateUserDevice,
         validateUserDeviceUpdate,
         validateRefreshTokenUser }
