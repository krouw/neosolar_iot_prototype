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
      else {
        //console.log(req.body);
        //console.log(req.params);
        Measurement.create({
          //required
          idDevice: req.body.name,
          //not required
          voltage: req.body.voltage,
          intensity: req.body.intensity
          })
          .then( measurement => {
            return res.status(201).json({
              success: true,
              message: 'Medición registrada con éxito.',
              measurement: measurement
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

      Measurement.findById({_id: req.params.idMeasurement})
      .then( measurement => {
        measurement.idDevice = req.params.idDevice;
        measuremen
        t.intensity = req.body.intensity;
        measurement.voltage = req.body.voltage;

        measurement.save((err) => {
          if (err)
            res.send(err);
        })
        return res.json('Dispositivo actualizado con éxito: ' + measurement )
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
      Measurement.findByIdAndRemove({_id: req.params.idMeasurement})
        .then( measurement => {
          if (measurement==null) {
            return res.json('Medición no encontrada.')
          }
          else {
            return res.json('Medición eliminada:' + measurement)
          }

        })

        .catch( err => {
          return res.status(500).json({
            success: false,
            message: 'No existe medición. Lo sentimos, Hubo un problema en responder tu solicitud.',
          });
        })
      }
    }

}

export default MeasurementController
