import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { SECRET } from '../config/config'
import Device from '../models/device'

const validateDeviceCreate = (body) => {
  let errors = {};
  let result = {};

  if(isEmpty(body)){
    errors.fields = 'Ingrese al menos un campo.'
  }

  if(isEmpty(body.name)){
    errors.name = 'Campo Requerido';
  }
  else{
    result.name = body.name
  }

  if(!isEmpty(body.coordenadas)){
    result.coordenadas = body.coordenadas
  }

  if(!isEmpty(body.battery)){
    result.battery = body.battery
  }

  if(!isEmpty(body.state)){
    result.state = body.state
  }

  if(isEmpty(body.password)){
    errors.password = 'Campo Requerido';
  }
  else if (body.password.length<6 || body.password.length>20 ) {
    errors.password = 'Contraseña de 6 a 20 caracteres'
  }
  else{
    result.password = body.password
  }

  return new Promise( (resolve, reject) => {
      if(isEmpty(errors)){
        resolve({
          device: result
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

const validateDeviceUpdate = (body, params) => {
  let errors = {};
  let result = {};

  if(!mongoose.Types.ObjectId.isValid(params.idDevice)){
    errors.id_device = 'Campo Inválido.';
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

  if(!isEmpty(body.state)){
    result.state = body.state
  }

  if(!isEmpty(body.password)){
    if (body.password.length<6 || body.password.length>20 ){
      errors.password = 'Contraseña de 6 a 20 caracteres'
    }
  }

  return new Promise((resolve, reject) => {
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
  });

}

const validateMsmCreate = (body, params) => {
  let errors = {};

  if(!mongoose.Types.ObjectId.isValid(params.idDevice)){
    errors.id_device = 'Campo Inválido.';
  }

  if(!body.intensity){
    errors.intensity = 'Campo requerido'
  }

  if(!body.voltageTotal){
    errors.voltage = 'Campo requerido'
  }

  if(!body.battery){
    errors.voltage = 'Campo requerido'
  }

  return new Promise( (resolve, reject) => {
    if(isEmpty(errors)){
      Device.findById(params.idDevice)
        .then((device) => {
          if(device){
            resolve({device: device})
          }
          else{
            errors.device = 'Recurso no Encontrado.'
            reject({
              errors: errors,
              status: 404
            })
          }
        })
        .catch((err) => {
          errors.server = 'Lo Sentimos, no hemos podido responder tu solicitud',
          reject({
            errors: errors,
            status: 500
          })
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

const validateRefreshTokenDevice = (body) => {

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

      Device.findById(body.id)
        .then((device) => {
          if(device){
            if(device.refreshToken === body.refreshToken){
              const deviceData = {
                sub: device._id,
                name: device.name,
                role: device.role,
              }
              jwt.sign(deviceData, SECRET.secret, { expiresIn: 10000 }, (err, token) => {
                if(err){
                  errors._error = 'Problemas con el servidor'
                  reject({
                    errors: errors,
                    status: 500,
                  })
                }
                else {
                  resolve({
                    value: device,
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
            errors.device = 'Not Found'
            reject({
              errors: errors,
              status: 404,
            })
          }
        })
        .catch((err) => {
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

export { validateDeviceCreate,
         validateDeviceUpdate,
         validateMsmCreate,
         validateRefreshTokenDevice }
