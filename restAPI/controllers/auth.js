import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcrypt'
import isEmpty from 'lodash/isEmpty';

import User from '../models/user';
import Device from '../models/device';
import { MONGO } from '../config/config';
import { validateSignIn,
         validateSingUp,
         validateGoogle,
         validateDevice } from '../validate/auth'

class AuthController {

  signin(req, res) {

    let validate = validateSignIn(req.body)
    if (validate.isValid) {
      User.findOne({ email: req.body.email })
      .then((user) => {
        if(user){
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
              const userData = {
                user:{_id: user._id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt}
              }
              var token = jwt.sign(userData, MONGO.secret, {
                expiresIn: 10000 //segundos
              });
              return res
                      .status(200)
                      .json({ status: 'OK',
                              token: `JWT ${token}`,
                              user: userData.user });
            }
            else {
              return res
                      .status(403)
                      .json({ status: 'Error',
                              errors: { password: 'Password Incorrecta' } });
            }
          })
        }
        else{
          return res
                  .status(404)
                  .json({ status: 'Error',
                          errors: { email: 'Usuario No Encontrado' } });
        }
      })
      .catch((err) => {
        return res
                .status(500)
                .json({ status: 'Error',
                        errors: { _error: 'Problemas con el servidor' } })
      })
    }
    else {
      return res
              .status(400)
              .json({ status: 'Error', errors: validate.errors });
    }

  }

  signup(req, res){

    validateSingUp(req.body)
      .then(({isValid}) => {
        User.create({
          email: req.body.email,
          password: req.body.password})
          .then((user) => {
            const userData = {
              user:{_id: user._id,
              email: user.email,
              role: user.role,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt}
            }
            var token = jwt.sign(userData, MONGO.secret, {
              expiresIn: 10000 //segundos
            });
            return res
                    .status(201)
                    .json({ status: 'OK',
                            token: `JWT ${token}`,
                            user: userData.user});
          })
          .catch((err) => {
            return res
                    .status(500)
                    .json({ status: 'Error',
                              errors: { _error: 'Problemas con el servidor' } })
          })
      })
      .catch(({errors, status}) => {
        return res
                .status(status)
                .json({ status: 'Error',
                        errors: errors })
      })

  }

  existEmail(req, res){
    if(!req.params.email){
     return res
              .status(400)
              .json({ status: 'Error',
                      errors: { email: 'Campo Requerido' } });
    }

    if(!validator.isEmail(req.params.email)){
     return res
              .status(400)
              .json({ status: 'Error',
                      errors: { email: 'El Campo debe ser un email'} });
    }

    User.findOne({ 'email' : req.params.email })
     .then( user => {
       if(user){
         return res
                  .status(400)
                  .json({ status: 'Error',
                          errors: { email: 'Este Correo ya está siendo utilizado'} });
       }
       else{
         return res
                  .status(200)
                  .json({ status: 'OK' })
       }
    })

  }

  google(req, res){

    const token = jwt.sign(req.user, MONGO.secret, {
      expiresIn: 10000 //segundos
    });

    const data = {
      token: `JWT ${token}`,
      user: req.user,
    }
    res.status(200).json(data);

  }


  googleNative(req, res){

    validateGoogle(req.body)
      .then(({errors, isValid, userid}) => {
        if(isValid){
          User.findOne({ 'google.id' : userid.id })
            .then( user => {
              if(user){
                const token = jwt.sign(user, MONGO.secret, {
                      expiresIn: 10000 //segundos
                });
                return res
                        .status(200)
                        .json({ user: user,
                                token: `JWT ${token}` });
              }
              else{
                User.create({
                  email: res.body.email,
                  google: userid,
                  password: id })
                  .then( userCreate => {
                    const token = jwt.sign(user, MONGO.secret, {
                          expiresIn: 10000 //segundos
                    });
                    return res
                            .status(201)
                            .json({ user: user, token: `JWT ${token}` });
                  })
                  .catch( err => {
                    return res
                            .status(400)
                            .json({ status: 'Error',
                                    errors: {email: 'Este Email ya está siendo utilizado'} })
                  })
              }
            })
        }
        else {
          return res.status(400).json({errors: errors, status: 'Error'})
        }
      })

  }

  deviceSignin(req, res) {

    let validate = validateDevice(req.body)
    if(validate.isValid){
      Device.findOne({_id: req.body.id})
        .then((device) => {
          if(device){
            bcrypt.compare(req.body.password, device.password)
            .then((validatePassword) => {
              if(validatePassword == false){
                return res
                        .status(403)
                        .json({ status: 'Error',
                                errors: { password: 'Password Incorrecta' } });
              }
              else{
                const deviceData = {
                  user:{_id: device._id,
                  name: device.name,
                  role: device.role,
                  createdAt: device.createdAt,
                  updatedAt: device.updatedAt}
                }
                let token = jwt.sign(deviceData, MONGO.secret, {
                  expiresIn: 10000 //segundos
                });
                return res
                        .status(200)
                        .json({ status: 'OK',
                                token: `JWT ${token}`,
                                device: device });
              }
            })
          }
          else{
            return res
                    .status(404)
                    .json({ status: 'Error',
                            errors: { device: 'Device No Encontrado' } });
          }
        })
        .catch((err) => {
          return res
                  .status(500)
                  .json({ status: 'Error',
                          errors: { _error: 'Problemas con el servidor' } })
        })
    }
    else {
      return res
              .status(400)
              .json({ status: 'Error',
                      errors: validate.errors });
    }

  }

}

export default AuthController;
