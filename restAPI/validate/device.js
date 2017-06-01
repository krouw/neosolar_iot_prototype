import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose'
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

export { validateDeviceCreate }
