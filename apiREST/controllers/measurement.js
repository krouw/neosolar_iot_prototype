import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import Measurement from '../models/measurement';

class MeasurementController {

  getAllMsm(req, res) {
    console.log(JSON.stringify(req.params));
    Measurement.find({})
      .then( measurements => {
        return res.json(measurements)
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
  }

getByIdMsm(req, res) {
  console.log(req.params);
  Measurement.findById({_id: req.params.idMeasurement})
    .then( measurement => {
      return res.json(measurement)
    })
    .catch( err => {
      return res.status(500).json({
        success: false,
        message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
      });
    })
  }

  createMsm(req, res) {
    if (validator.isEmail(req.body.email+'')) {
      if(!req.body.email || !req.body.password) {
        res.status(422).json({
          success: false,
          message: 'Por favor ingrese email y contraseña.'
        });
      }
      else{
        console.log(req.body);
        console.log(req.params);
        Measurement.create({
          idDevice: req.body.name,
          voltage: req.body.voltage,
          intensity: req.body.intensity
          })
          .then( measurement => {
            return res.status(201).json({
              success: true,
              message: 'Medición registrada con éxito.',
              measurement: measurement,
            });
          })
          .catch( err => {
            return res.status(422).json({
              success: false,
              message: 'La medición no se ha registrado.',
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

  updateMsm(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({
        success: false,
        message: 'Por favor ingrese email y contraseña.'
      });
    }
    else {
      console.log(req.params.idMeasurement);
      Measurement.findById({_id: req.params.idMeasurement})
      .then( device => {
        measurement.intensity = req.body.intensity;
        measurement.voltage = req.body.voltage;

        measurement.save((err) => {
          if (err)
            res.send(err);
        })
        return res.json('Dispositivo actualizado con éxito' )
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
    }
  }

  deleteMsm(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({
        success: false,
        message: 'Por favor ingrese email y contraseña.'
      });
    }
    else {
      console.log(req.params.idMeasurement);
      Measurement.findByIdAndRemove({_id: req.params.idMeasurement})
        .then( device => {
          if (device==null) {
            return res.json('Dispositivo no encontrado.')
          }
          else {
            return res.json('Dispositivo eliminado.')
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

export default MeasurementController
