import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import Device from '../models/device';

class DeviceController {

  getAllDev(req, res) {
    Device.find({})
      .then( devices => {
        return res.status(200).json({status:'OK', data: {devices: devices}})
      })
      .catch( err => {
        return res.status(500).json({
          status: 'Error',
          message: 'Lo Sentimos, no hemos podido responder tu solicitud',
        });
      })
  }

  getByIdDev(req, res) {
    Device.findById({_id: req.params.idDevice})
      .then( device => {
        console.log(device);
        return res.status(200).json(device)
      })
      .catch( err => {
        return res.status(500).json({ message: 'Lo sentimos, Hubo un problema en responder tu solicitud.' });
      })
  }

  //post
  createDev(req, res) {
      if(!req.body.name && !req.body.password) {
        return res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
      }
      else{
        Device.create({
          name: req.body.name,
          password: req.body.password
        })
        .then( device => {
          return res.status(201).json({
            message: 'Dispositivo registrado con éxito.',
            device: device,
          });
        })
        .catch( err => {
          return res.status(422).json({
            message: 'El dispositivo ya está registrado: ' + JSON.stringify(req.body)
          });
        })
      }
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
