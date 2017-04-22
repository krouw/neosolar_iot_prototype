import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import Device from '../models/device';

class DeviceController {

  getAllDev(req, res) {
    console.log(JSON.stringify(req.params));
    Device.find({})
      .then( devices => {
        return res.json(devices)
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
  }

  getByIdDev(req, res) {
    Device.findById({_id: req.params.idDevice})
      .then( device => {
        console.log(device);
        return res.json(device)
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
  }
  //post
  createDev(req, res) {
    if (validator.isEmail(req.body.email+'')) {
      if(!req.body.email || !req.body.password) {
        res.status(422).json({
          success: false,
          message: 'Por favor ingrese email y contraseña.'
        });
      }
      else{
        console.log(req.body);
        //console.log(req.params);
        Device.create({
          //required
          idDevice: req.body.name,
          name: req.body.name,
          //not required
          email: req.body.email,
          password: req.body.password })
          .then( device => {
            return res.status(201).json({
              success: true,
              message: 'Dispositivo registrado con éxito.',
              device: device,
            });

          })
          .catch( err => {
            return res.status(422).json({
              success: false,
              message: 'El dispositivo ya está creado.',
            });
          })
      }
    }
    else{
      res.status(422).json({
        success: false,
        message: 'Por favor ingrese email válido.'
      });
    }
  }

  updateDev(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({
        success: false,
        message: 'Por favor ingrese email y contraseña.'
      });
    }
    else {
      console.log(req.params);
      Device.findById({_id: req.params.idDevice})
      .then( device => {
        console.log(req.body);
        device._id = req.params.idDevice;
        //provisional
        device.name = req.params.name;

        device.save((err) => {
          if (err)
            res.send(err);
        })
        return res.json('Dispositivo actualizado con éxito: ' + device)
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
    }
  }

  deleteDev(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({
        success: false,
        message: 'Por favor ingrese email y contraseña.'
      });
    }
    else {
      console.log(req.params.idDevice);
      Device.findByIdAndRemove({_id: req.params.idDevice})
        .then( device => {
          if (device==null) {
            return res.json('Dispositivo no encontrado.')
          }
          else {
            return res.json('Dispositivo eliminado: ' + device)
          }

        })

        .catch( err => {
          return res.status(500).json({
            success: false,
            message: 'No existe dispositivo. Lo sentimos, Hubo un problema en responder tu solicitud.',
          });
        })
      }
    }

}

export default DeviceController
