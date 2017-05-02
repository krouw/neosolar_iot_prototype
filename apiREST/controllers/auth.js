import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

import User from '../models/user';
import Device from '../models/device';
import { mongo } from '../config/config';

function validateInput(data){
    let errors = {};

    if(isEmpty(data)){
       return {
         errors: 'No se ha enviado ningun campo',
         isValid: false,
       }
    }

    //validator.email sin un string devuelve err server
    if(isEmpty(data.email)){
      errors.email = 'Campo Requerido'
    }
    else{
      if(!validator.isEmail(data.email)){
        errors.email = 'Email inválido'
      }
    }


    return User.findOne({ 'email' : data.email })
      .then( user => {
        if(user){
          if(user.email === data.email){
            errors.email = 'Este email está siendo utilizado por un usuario'
          }
        }
        return {
          errors,
          isValid: isEmpty(errors)
        }
      })
}

class AuthController {

  signin(req, res) {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) throw (err);

      if(!user) {
        res.status(401).json({ success: false, message: 'Fallo en la autenticación. Usuario no registrado.'});
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            var token = jwt.sign(user, mongo.secret, {
              expiresIn: 10000 //segundos
            });
            res.status(201).json({ success: true, token: 'JWT '+ token, user: user.email});
          } else {
            res.status(401).json({ success: false, message: 'Fallo en la autenticación. La clave no coincide.'});
          }
        });
      }
    });
  }

  signup(req, res) {
    if (validator.isEmail(req.body.email+'')) {
      if(!req.body.email || !req.body.password) {
      res.json({ success: false, message: 'Porfavor ingrese email y contraseña.'});
      } else {
        var newUser = new User({
          email: req.body.email,
          password: req.body.password
        });
      //guardar usuario
      newUser.save( (err) => {
        if (err) {
          return res.json({success: false, message: 'El correo ya existe'});
        }
        res.json({ success: true, message: 'Usuario registrado con éxito.'});
        });
      }
    }
    else {
      res.send({ success: false, message: 'Ingrese un correo válido.'});
    }
  }

  existEmail(req, res){
    //Example validate
    validateInput(req.body)
      .then(({ errors, isValid}) => {
        if(isValid){
          res.status(200).json({email:'Email valido'});
        }
        else{
          res.status(400).json(errors)
        }
      })
  }

  google(req, res){
    const token = jwt.sign(req.user, mongo.secret, {
      expiresIn: 10000 //segundos
    });
    const data = {
      token: "JWT "+token,
      user: req.user,
    }
    res.status(200).json(data);
  }

  signout(req, res) {
    req.logout();
    res.redirect('/');
/*
    req.logout();
    res.status(200).json({action: 'AUTH_LOGOUT'})
    return res.status(200).json({
      "message": "User has been successfully logged out"
    });
    res.redirect("/api");
*/
  }
// Login para Raspi, valida la peticion de datos en el cliente.
  device(req, res) {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) throw (err);

      if(!user) {
        res.send({ success: false, message: 'Fallo en la autenticación. Usuario no registrado.'});
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            var token = jwt.sign(user, mongo.secret, {
              expiresIn: 10000 //segundos
            });
            var data = {
            token: 'JWT ' + token,
            };
            res.json({ success: true, data: data});
          } else {
            res.send({ success: false, message: 'Fallo en la autenticación. La clave no coincide.'});
          }
        });
      }
    });
  }
}

export default AuthController;
