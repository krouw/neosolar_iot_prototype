import mongoose from 'mongoose';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import Indicator from '../models/indicator'

export const createIndicator = (type, value) => {

    let errors = {}

    if(isEmpty(type)) {
      errors.type = 'Campo Requerido'
    }

    if(!isNumber(value)) {
      errors.value = 'Este campo debe ser un número'
    }


    if(isEmpty(errors)) {
      Indicator.create({ type: type, value: value })
        .then((indicator) => {
          console.log(indicator);
        })
        .catch((err) => {
          errors._error = 'Problemas con Mongo'
          console.log(errors);
        })
    }
    else {
      console.log(errors);
    }

}
