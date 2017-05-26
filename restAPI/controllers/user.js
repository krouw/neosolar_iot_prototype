import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import User from '../models/user';
import Device from '../models/device';
import { validateUser,
         validateUserUpdate,
         validateUserDevice } from '../libs/validate'

class UserController {

  //get
  getAll(req, res) {
    User.find({})
      .populate({path: 'devices', select: '-__v -password'})
      .then( users => {
        return res
                .status(200)
                .json({status:'OK', data: {users: users}})
      })
      .catch( err => {
        return res
                .status(500)
                .json({ status: 'Error', errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
      })
  }

  //get
  getById(req, res) {
    if(mongoose.Types.ObjectId.isValid(req.params.idUser)){
      User.findById({_id: req.params.idUser})
        .populate({path: 'devices', select: '-__v -password'})
        .then( user => {
          if(user){
            return res
                    .status(200)
                    .json({status:'OK', data: {user: user}})
          }
          else{
            return res.status(404).json({ status: 'Not Found', errors: { user: 'Este recurso no Existe.' } })
          }
        })
        .catch( err => {
          return res.status(500).json({ status: 'Error', errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
        })
    }
    else{
      return res.status(400).json({ status: 'Error', errors: { id: 'Campo Inválido.' } });
    }
  }

  //post
  create(req, res) {
    validateUser(req.body, true)
      .then(({errors, isValid}) => {
        if(isValid) {
          User.create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            role: req.body.role })
            .then((user) => {
              return res.status(201).json({ status: 'OK', data: { user: user } });
            })
            .catch((err) => {
              return res.status(500).json({ status: 'Error', errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
            })
        }
        else {
          res.status(400).json({ status: 'Error', errors: errors });
        }
      })
  }

  //put
  update(req, res) {
    validateUserUpdate(req.body, req.user, req.params.idUser)
      .then(({update}) => {

        User.findByIdAndUpdate(req.params.idUser, update , {new:true})
          .populate({path: 'devices', select: '-__v -password'})
          .then( user => {
            if (user) {
              return res
                      .status(200)
                      .json({status:'OK', data: {user: user}})
            }
            else{
              return res.status(404).json({ status: 'Not Found', errors: { user: 'Este recurso no Existe.' } })
            }
          })
          .catch( err => {
            return res.status(500).json({ status: 'Error', errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
          })
      })
      .catch(({errors}) => {
        return res.status(400).json({ status: 'Error', errors: errors })
      })
  }

  //delete
  delete(req, res) {
    if(mongoose.Types.ObjectId.isValid(req.params.idUser)){
      User.findByIdAndRemove(req.params.idUser)
        .then( user => {
          if (!user) {
            return res.status(404).json({status: 'Error', errors: { user: 'Usuario no encontrado.' }})
          }
          else {
            return res.status(200).json({ status: 'OK', data: { user: 'Usuario Eliminado' }})
          }

        })
        .catch( err => {
          return res.status(500).json({ message: 'Lo Sentimos, no hemos podido responder tu solicitud.' });
        })
    }
    else{
      return res.status(400).json({ status: 'Error', errors: { id: 'Campo Inválido.' } })
    }
  }

  //get all
  getAllDev(req, res) {

    if(mongoose.Types.ObjectId.isValid(req.params.idUser)){
      User.findById(req.params.idUser)
        .populate({path: 'devices', select: '-__v -password'})
        .then( user => {
          if(user){
            return res
                    .status(200)
                    .json({status:'OK', data: { devices: user.devices}})
          }
          else{
            return res.status(404).json({ status: 'Not Found', errors: { user: 'Este recurso no Existe.' } })
          }
        })
        .catch( err => {
          return res.status(500).json({ status: 'Error', errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
        })
    }
    else{
      return res.status(400).json({ status: 'Error', errors: { id: 'Campo Inválido.' } });
    }
  }

  // get
  getByIdDev(req, res) {
    if(mongoose.Types.ObjectId.isValid(req.params.idUser)){
      if(mongoose.Types.ObjectId.isValid(req.params.idDevice)){
        User.findById(req.params.idUser)
          .populate({path: 'devices', select: '-__v -password'})
          .then((user) => {
            if(user){
              const isDevice = user.devices.filter( device => {
                  return device._id == req.params.idDevice
              })
              if(!isEmpty(isDevice)){
                return res.status(200).json({ status: 'OK', data: { device: isDevice[0] } })
              }
              else{
                return res.status(404).json({ status: 'Not Found', errors: { device: 'Este recurso no Existe.' } })
              }
            }
            else{
              return res.status(404).json({ status: 'Not Found', errors: { user: 'Este recurso no Existe.' } })
            }
          })
          .catch((err) => {
            return res.status(500).json({ status: 'Error', errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
          })
      }
      else{
        return res.status(400).json({ status: 'Error', errors: { id_device: 'Campo Inválido.' } });
      }
    }
    else{
      return res.status(400).json({ status: 'Error', errors: { id_user: 'Campo Inválido.' } });
    }
  }

  createDev(req, res) {
    validateUserDevice(req.body, req.params.idUser)
      .then(({device}) => {
        User.findById(req.params.idUser)
          .then( user => {
            if (user) {
              user.devices.push(req.body.id);
              user.save()
                .then( updateUser => {
                  device.users.push(updateUser._id);
                  device.save()
                    .then( updateDevice => {
                      Device.populate(updateUser, {path: "devices", select: '-__v -password'},function(err, populateUser){
                         return res.status(201).json({ status: 'OK', data: { user: populateUser } })
                      });
                    })
                    .catch((err) => {
                      return res.status(400).json({ status: 'Error', errors: { user: 'Este usuario ya está registrado en el dispositivo.' } })
                    })
                })
                .catch((err) => {
                  return res.status(400).json({ status: 'Error', errors: { device: 'Este dispositivo ya está registrado.' } })
                })
            }
            else{
              return res.status(404).json({ status: 'Not Found', errors: { user: 'Este recurso no Existe.' } })
            }
          })
          .catch( err => {
            return res.status(500).json({ status: 'Error', errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
          })
      })
      .catch(({errors}) => {
        return res.status(400).json({ status: 'Error', errors: errors })
      })
  }

  updateDev(req, res) {
    if(!req.body.email || !req.body.password) {
      res.status(422).json({ message: 'Por favor ingrese email y contraseña.' });
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
        return res.status(200).json('Dispositivo actualizado con éxito: ' + device )
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
            return res.status(400).json('Dispositivo no encontrado.')
          }
          else {
            return res.status(200).json('Dispositivo eliminado: ' + device.idUser + ', ' + device.name)
          }
        })

        .catch( err => {
          return res.status(500).json({  message: 'No existe dispositivo. Lo sentimos, Hubo un problema en responder tu solicitud.' });
        })
      }
    }
}

export default UserController
