import express from 'express';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import mongoose from 'mongoose';
import User from '../models/user';
import Device from '../models/device';
import randtoken from 'rand-token'
import { validateUserCreate,
         validateUserUpdate,
         validateUserDevice,
         validateUserDevDelete,
         validateUserDeviceUpdate,
         validateRefreshTokenUser } from '../validate/user'

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
                .json({ status: 'Error',
                        errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
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
            return res
                    .status(404)
                    .json({ status: 'Not Found',
                            errors: { user: 'Este recurso no Existe.' } })
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
                      errors: { id_user: 'Campo Inválido.' } });
    }
  }

  //post
  create(req, res) {
    validateUserCreate(req.body, req.user)
      .then(({ result }) => {
        User.create(result)
          .then((user) => {
            return res
                    .status(201)
                    .json({ status: 'OK',
                            data: { user: user } });
          })
          .catch((err) => {
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

  //put
  update(req, res) {
    validateUserUpdate(req.body, req.user, req.params)
      .then(({update}) => {

        User.findByIdAndUpdate(req.params.idUser, update , {new:true} )
          .populate({path: 'devices', select: '-__v -password'})
          .then( user => {
            if (user) {
              return res
                      .status(200)
                      .json({status:'OK', data: { user: user }})
            }
            else{
              return res
                      .status(404)
                      .json({ status: 'Not Found',
                              errors: { user: 'Este recurso no Existe.' } })
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
        return res.status(status).json({ status: 'Error', errors: errors })
      })
  }

  //delete
  delete(req, res) {
    if(mongoose.Types.ObjectId.isValid(req.params.idUser)){
      User.findByIdAndRemove(req.params.idUser)
        .then( user => {
          if (!user) {
            return res
                    .status(404)
                    .json({ status: 'Error',
                            errors: { user: 'Recurso no encontrado.' }})
          }
          else {
            return res
                    .status(200)
                    .json({ status: 'OK',
                            data: { user: 'Recurso Eliminado' }})
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
              .json({ status: 'Error', errors: { id_user: 'Campo Inválido.' } })
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
            return res
                    .status(404)
                    .json({ status: 'Not Found',
                            errors: { user: 'Este recurso no Existe.' } })
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
                      errors: { id_user: 'Campo Inválido.' } });
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
                return res
                        .status(200)
                        .json({ status: 'OK', data: { device: isDevice[0] } })
              }
              else{
                return res
                        .status(404)
                        .json({ status: 'Not Found',
                                errors: { device: 'Este recurso no Existe.' } })
              }
            }
            else{
              return res
                      .status(404)
                      .json({ status: 'Not Found',
                              errors: { user: 'Este recurso no Existe.' } })
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
                .status(400)
                .json({ status: 'Error',
                        errors: { id_device: 'Campo Inválido.' } });
      }
    }
    else{
      return res
              .status(400)
              .json({ status: 'Error',
                      errors: { id_user: 'Campo Inválido.' } });
    }
  }

  createDev(req, res) {
    validateUserDevice(req.body, req.params)
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
                         return res
                                .status(201)
                                .json({ status: 'OK',
                                        data: { user: populateUser } })
                      });
                    })
                    .catch((err) => {
                      return res
                              .status(400)
                              .json({ status: 'Error',
                                      errors: { user: 'Este usuario ya está registrado en el dispositivo.' } })
                    })
                })
                .catch((err) => {
                  return res
                          .status(400)
                          .json({ status: 'Error',
                                  errors: { device: 'Este dispositivo ya está registrado.' } })
                })
            }
            else{
              return res
                      .status(404)
                      .json({ status: 'Not Found',
                              errors: { user: 'Este recurso no Existe.' } })
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
                .json({ status: 'Error', errors: errors })
      })
  }

  updateDev(req, res) {
    validateUserDeviceUpdate(req.params, req.body)
    .then(({update}) => {
      Device.findByIdAndUpdate(req.params.idDevice, update , {new:true})
        .populate({path: 'users', select: '-__v -password'})
        .then( device => {
          if (device) {
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
    })
    .catch(({errors, status}) => {
      return res
              .status(status)
              .json({ status: 'Error',
                      errors: errors })
    })
  }

  deleteDev(req, res) {
    validateUserDevDelete(req.params)
      .then(({newDevices, newUsers}) => {
        User.findByIdAndUpdate(req.params.idUser, { devices: newDevices } , {new:true})
          .populate({path: 'devices', select: '-__v -password'})
          .then( user => {
            if (user) {
              Device.findByIdAndUpdate(req.params.idDevice, { users: newUsers }, {new:true})
                .then((device) => {
                  if(device){
                    return res
                            .status(200)
                            .json({status:'OK', data: {user: user}})
                  }
                  else{
                    return res
                            .status(404)
                            .json({ status: 'Error',
                                    erorrs: { device: 'Recurso No Encontrado' }  })
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
                              errors: { user: 'Este recurso no Existe.' } })
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


  refreshTokenUser(req, res) {

      validateRefreshTokenUser(req.body)
        .then( ( {value, token} ) => {
          return res
                  .status(200)
                  .json({ status: 'OK',
                          token: `JWT ${token}`,
                          user: value });
        })
        .catch( ( {errors, status} ) => {
          return res
                  .status(status)
                  .json( { status: 'Error',
                          errors: errors } )
        })
  }

  deleteRefreshTokenUser(req, res){

    User.findOne({ refreshToken: req.body.refreshToken })
      .then((value) => {
        if (value) {
          var refreshToken = randtoken.uid(256)
          User.findByIdAndUpdate(value._id, {refreshToken: refreshToken} , {new:true} )
            .populate({path: 'devices', select: '-__v -password'})
            .then( user => {
              if (user) {
                return res
                        .status(200)
                        .json({status:'OK', data: { user: user }})
              }
              else{
                return res
                        .status(404)
                        .json({ status: 'Not Found',
                                errors: { user: 'Este recurso no Existe.' } })
              }
            })
            .catch( err => {
              return res
                      .status(500)
                      .json({ status: 'Error',
                              errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
            })
        }
        else {
          return res
                  .status(404)
                  .json({ status: 'Not Found',
                          errors: { refreshToken: 'Este recurso no Existe.' } })  
        }
      })
      .catch((err) => {
        return res
                .status(500)
                .json({ status: 'Error',
                        errors: { server: 'Lo Sentimos, no hemos podido responder tu solicitud' } })
      })

  }

}

export default UserController
