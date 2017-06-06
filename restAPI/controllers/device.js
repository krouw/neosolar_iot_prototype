import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import Device from '../models/device';
import Measurement from '../models/measurement';
import { validateDeviceCreate,
         validateDeviceUpdate,
         validateMsmCreate } from '../validate/device'
import { createJob } from '../queue/indicators'

class DeviceController {

  getAllDev(req, res) {
    Device.find({})
      .populate({path: 'users', select: '-__v -password'})
      .then( devices => {
        return res
                .status(200)
                .json({status:'OK', data: {devices: devices}})
      })
      .catch( err => {
        return res
                .status(500)
                .json({ status: 'Error',
                        errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } });
      })
  }

  getById(req, res) {
    if(mongoose.Types.ObjectId.isValid(req.params.idDevice)){
      Device.findById(req.params.idDevice)
        .populate({path: 'users', select: '-__v -password'})
        .then( device => {
          if(device){
            return res
                    .status(200)
                    .json({status:'OK', data: {device: device}})
          }
          else{
            return res
                    .status(404)
                    .json({ status: 'Not Found',
                            errors: { device: 'Este recurso no Existe.' } })
          }
        })
        .catch( err => {
          return res
                  .status(500)
                  .json({ status: 'Error',
                  errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
        })
    }
    else{
      return res
              .status(400)
              .json({ status: 'Error',
                      errors: { id: 'Campo Inválido.' } });
    }
  }

  //post
  createDev(req, res) {

    validateDeviceCreate(req.body)
      .then(({device}) => {
        Device.create(device)
        .then( device => {
          return res
                  .status(201)
                  .json({ status: 'OK',
                          data: { device: device} });
        })
        .catch( err => {
          return res
                  .status(500)
                  .json({ status: 'Error',
                            errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } });
        })
      })
      .catch(({errors, status}) => {
        return res
                .status(status)
                .json({ status: 'Error',
                        errors: errors })
      })

  }

  //put
  updateDev(req, res) {
    validateDeviceUpdate(req.body, req.params)
      .then(({update}) => {
        Device.findByIdAndUpdate(req.params.idDevice, update , {new:true} )
          .populate({path: 'users', select: '-__v -password'})
          .then( device => {
            if (device) {
              return res
                      .status(200)
                      .json({status:'OK', data: { device: device }})
            }
            else{
              return res
                      .status(404)
                      .json({ status: 'Not Found',
                              errors: { device: 'Este recurso no Existe.' } })
            }
          })
          .catch( err => {
            return res
                    .status(500)
                    .json({ status: 'Error',
                            errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
          })
      })
      .catch(({errors, status}) => {
        return res
                .status(status)
                .json({ status: 'Error',
                        errors: errors })
      })
  }

  deleteDev(req, res) {
    if(mongoose.Types.ObjectId.isValid(req.params.idDevice)){
      Device.findByIdAndRemove(req.params.idDevice)
        .then( device => {
          if (!device) {
            return res
                    .status(404)
                    .json({ status: 'Error',
                            errors: { device: 'Recurso no encontrado.' }})
          }
          else {
            return res
                    .status(200)
                    .json({ status: 'OK',
                            data: { device: 'Recurso Eliminado' }})
          }

        })
        .catch( err => {
          return res
                  .status(500)
                  .json({ message: 'Lo Sentimos, no hemos podido responder tu solicitud.' });
        })
    }
    else{
      return res
              .status(400)
              .json({ status: 'Error', errors: { id_device: 'Campo Inválido.' } })
    }
  }

  getAllDevMsm(req, res){
    if(mongoose.Types.ObjectId.isValid(req.params.idDevice)){
      Device.findById(req.params.idDevice)
        .then( device => {
          if(device){
            Measurement.find({ device: req.params.idDevice })
              .then((msm) => {
                if(msm){
                  createJob((err) => {
                    console.log(err);
                  })
                  return res
                          .status(200)
                          .json({ status: 'OK',
                                  data: { device: device, measurement: msm}  })
                }
                else{
                  return res
                          .status(404)
                          .json({ status: 'Not Found',
                                  errors: { measurement: 'Este recurso no Existe.' } })
                }
              })
              .catch((err) => {
                return res
                        .status(500)
                        .json({ status: 'Error',
                                errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
              })
          }
          else{
            return res
                    .status(404)
                    .json({ status: 'Not Found',
                            errors: { device: 'Este recurso no Existe.' } })
          }
        })
        .catch( err => {
          return res
                  .status(500)
                  .json({ status: 'Error',
                          errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
        })
    }
    else{
      return res
              .status(400)
              .json({ status: 'Error',
                      errors: { id_device: 'Campo Inválido.' } });
    }
  }

  createDevMsm(req, res){
    validateMsmCreate(req.body, req.params)
      .then(({device}) => {
        Measurement.create({
          intensity: req.body.intensity,
          voltage: req.body.voltage,
          device: req.params.idDevice
        })
        .then((msm) => {
          return res
                  .status(201)
                  .json({ status: 'OK',
                          data: { device: device, measurement: msm } })
        })
        .catch((err) => {
          console.log(err);
          return res
                  .status(500)
                  .json({ status: 'Errors',
                          errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' }  })
        })
      })
      .catch(({errors, status}) => {
        return res
                .status(status)
                .json({ status: 'Error',
                        errors: errors })
      })

  }

}

export default DeviceController
