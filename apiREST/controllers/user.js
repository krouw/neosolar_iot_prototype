import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import User from '../models/user';
import Device from '../models/device';

class UserController {

  //get
  getAll(req, res) {
    User.find({})
      .then( users => {
        return res.json(users)
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
  }
  //get
  getById(req, res) {
    User.findById({_id: req.params.idUser})
      .then( user => {
        return res.json(user)
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
  }
  //post
  create(req, res) {
    if (validator.isEmail(req.body.email+'')) {
      if(!req.body.email || !req.body.password) {
        res.status(422).json({
          success: false,
          message: 'Por favor ingrese email y contraseña.'
        });
      }
      else{
        User.create({
          email: req.body.email,
          password: req.body.password })
          .then( user => {
            return res.status(201).json({
              success: true,
              message: 'Usuario registrado con éxito.',
              user: user,
            });
          })
          .catch( err => {
            return res.status(422).json({
              success: false,
              message: 'El correo ya está siendo utilizado.',
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
  //put
  update(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({
        success: false,
        message: 'Por favor ingrese email y contraseña.'
      });
    }
    else {
      User.findById({_id: req.params.idUser})
      .then( user => {
        user.email = req.body.email;
        user.password = req.body.password;

        user.save((err) => {
          if (err)
            res.send(err);
        })
        return res.json('Usuario actualizado con éxito' + user )
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
    }
  }
  //delete
  delete(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({
        success: false,
        message: 'Por favor ingrese email y contraseña.'
      });
    }
    else {
      User.findByIdAndRemove({_id: req.params.idUser})
        .then( user => {
          console.log(user);
          if (user==null) {
            return res.json('Usuario no encontrado.')
          }
          else {
            return res.json('Usuario eliminado.')
          }

        })

        .catch( err => {
          return res.status(500).json({
            success: false,
            message: 'No existe usuario. Lo sentimos, Hubo un problema en responder tu solicitud.',
          });
        })
      }
    }

  getAllDev(req, res) {
    console.log(req.params);
    //'id' : mail
    Device.find({ idUser: req.params.idUser })
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
    console.log('dev:'+ req.params);
    Device.findById({_id: req.params.idDevice})
      .then( device => {
        return res.json(device)
      })
      .catch( err => {
        return res.status(500).json({
          success: false,
          message: 'Lo sentimos, Hubo un problema en responder tu solicitud.',
        });
      })
  }

  createDev(req, res) {
    //console.log(req.params.id)
    if (validator.isEmail(req.body.email+'')) {
      if(!req.body.email || !req.body.password) {
        res.status(422).json({
          success: false,
          message: 'Por favor ingrese email y contraseña.'
        });
      }
      else{
          Device.create({
          idUser: req.params.idUser,
          name : req.body.name,
          })
          .then( device => {
            return res.status(201).json({
              success: true,
              message: 'Dispositivo registrado con éxito.',
              device: device
            });
          })
          .catch( err => {
            console.log(err);
            return res.status(422).json({
              success: false,
              message: 'Dispositivo no se ha registrado con éxito.',
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
      Device.findById({_id: req.params.idDevice})
      .then( device => {
        device.email = req.body.email;
        device.password = req.body.password;

        device.save((err) => {
          if (err)
            res.send(err);
        })
        return res.json('Dispositivo actualizado con éxito: ' + device )
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
      Device.findByIdAndRemove({_id: req.params.idDevice})
        .then( device => {
          if (device==null) {
            return res.json('Dispositivo no encontrado.')
          }
          else {
            return res.json('Dispositivo eliminado: ' + device.idUser + ', ' + device.name)
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

export default UserController
