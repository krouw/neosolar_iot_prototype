import kue from 'kue'
import mongoose from 'mongoose'
import isEmpty from 'lodash/isEmpty'
import Device from '../models/device'
import Measurement from '../models/measurement'

const queue = kue.createQueue();
queue.watchStuckJobs(1000 * 10);

function addQeueMeasurement(data, done) {
  queue.create('addMeasurement', data)
    .attempts(3)
    .save( err => {
      if (err) {
        console.error('Error create queue ' + err)
        done(err);
      }
      if (!err) {
        done();
      }
    });
}

queue.process('addMeasurement', (job, done) => {
  Measurement.create(job.data)
  .then((msm) => {
  })
  .catch((err) => {
    console.log('Error Persist ', jon.data);
  })
  done()
});

export const validateMsmCreate = (payload) => {
  let errors = {};

  if(!mongoose.Types.ObjectId.isValid(payload.device)){
    errors.id_device = 'Campo Inválido.';
  }

  if(!payload.intensity){
    errors.intensity = 'Campo requerido'
  }

  if(!payload.voltageTotal){
    errors.voltage = 'Campo requerido'
  }

  if(!payload.battery){
    errors.voltage = 'Campo requerido'
  }

  return new Promise( (resolve, reject) => {
    if(isEmpty(errors)){
      Device.findById(payload.device)
        .then((device) => {
          if(device){
            resolve({device: device})
          }
          else{
            errors.device = 'Recurso no Encontrado.'
            reject({
              errors: errors,
            })
          }
        })
        .catch((err) => {
          errors.server = 'Lo Sentimos, no hemos podido responder tu solicitud',
          reject({
            errors: errors,
          })
        })
    }
    else{
      reject({
        errors: errors,
      })
    }
  });

}

export const createMeasurement = (data, done) => {
  addQeueMeasurement(data, done)
}
