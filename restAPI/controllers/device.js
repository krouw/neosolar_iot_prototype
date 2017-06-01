import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import Device from '../models/device';
import { validateDeviceCreate } from '../validate/device'

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
    if(!req.body.email || !req.body.password) {
      res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
    }
    else {
      Device.findById({_id: req.params.idDevice})
      .then( device => {
        device._id = req.params.idDevice;
        device.name = req.params.name;

        device.save((err) => {
          if (err)
            res.send(err);
        })
        //revisar codigo 200
        return res.status(200).json('Dispositivo actualizado con éxito: ' + device)
      })
      .catch( err => {
        return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
    }
  }

  deleteDev(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
    }
    else {
      Device.findByIdAndRemove({_id: req.params.idDevice})
        .then( device => {
          if (device==null) {
            //revisar cod 400
            return res.status(400).json('Dispositivo no encontrado: ' + req.params.idDevice)
          }
          else {
            //revisar 200
            return res.status(200).json('Dispositivo eliminado: ' + device)
          }

        })

        .catch( err => {
          return res.status(500).json({ message: 'No existe dispositivo. Lo sentimos, Hubo un problema en responder tu solicitud.' });
        })
      }
    }

}

export default DeviceController
