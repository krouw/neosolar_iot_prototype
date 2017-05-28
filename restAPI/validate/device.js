import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose'
import Device from '../models/device'

const validateDevice = (data) =>{
  let errors = {};

  if(isEmpty(data)){
    errors.fields = 'Ingrese al menos un campo.'
  }

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

export { validateDevice }
