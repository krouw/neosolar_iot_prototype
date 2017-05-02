import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import GoogleAuth from 'google-auth-library'
import { socialAuth } from '../config/socialAuth'

import User from '../models/user';
import Device from '../models/device';
import { mongo } from '../config/config';

function validateUser(data, db){
    let errors = {};

    //validator.email sin un string devuelve err server
    if(isEmpty(data.email)){
      errors.email = 'Campo Requerido'
    }
    else{
      if(!validator.isEmail(data.email)){
        errors.email = 'Email inválido'
      }
    }
    if(db){
      //Retorno una funcion (Promise) y recibo resultado
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
    else{
      //Retorno un objeto
      return {
        errors,
        isValid: isEmpty(errors)
      }
    }
}

function validateGoogle(data){
  let errors = {};
  const auth = new GoogleAuth;
  let client = new auth.OAuth2(data.id,'','');

  //validator.email sin un string devuelve err server
  if(isEmpty(data.email)){
    errors.email = 'Campo Requerido'
  }
  else{
    if(!validator.isEmail(data.email)){
      errors.email = 'Email inválido'
    }
  }

  if(isEmpty(data.id)){
    errors.id = 'Campo Requerido'
  }

  if(isEmpty(data.idToken)){
    errors.idToken = 'Compo Requerido'
  }

  return new Promise( (resolve, reject) => {
    if(!isEmpty(errors)){
      return resolve({
        errors: errors,
        isValid: isEmpty(errors)
      })
    }
    else{
      var auth = new GoogleAuth;
      var client = new auth.OAuth2(socialAuth.clientID, '', '');

      client.verifyIdToken(data.idToken, socialAuth.clientID, (err, login) => {
        if(err){
          errors.google = 'Problemas validación con Google'
          return resolve({
            errors: errors,
            isValid: isEmpty(errors)
          })
        }
        const payload = login.getPayload();
        const userid = {id: payload['sub']};

        User.findOne({ 'google.id' : userid.id })
          .then( user => {
            if(user){
              return resolve({
                user: user,
                errors: errors,
                isValid: isEmpty(errors)
              })
            }
            else{
              User.create({
                email: data.email,
                google: userid,
                password: data.id })
                .then( userCreate => {
                  return resolve({
                    user: userCreate,
                    errors: errors,
                    isValid: isEmpty(errors)
                  })
                })
                .catch( err => {
                  errors.email = 'Este Email ya está siendo utilizado'
                   return resolve({
                     errors: errors,
                     isValid: isEmpty(errors)
                   })
                })
            }
          })
          .catch( err => {
            return resolve({
              errors: errors,
              isValid: isEmpty(errors)
            })
          })
      })
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
        res.status(401).json({ message: 'Fallo en la autenticación. Usuario no registrado.'});
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            var token = jwt.sign(user, mongo.secret, {
              expiresIn: 10000 //segundos
            });
            res.status(201).json({ token: 'JWT '+ token, user: user.email});
          } else {
            res.status(401).json({ message: 'Fallo en la autenticación. La clave no coincide.'});
          }
        });
      }
    });
  }

  signup(req, res) {
    if (validator.isEmail(req.body.email+'')) {
      if(!req.body.email || !req.body.password) {
        //modificar los codigos 400
      res.status(400).json({ message: 'Porfavor ingrese email y contraseña.' });
      } else {
        var newUser = new User({
          email: req.body.email,
          password: req.body.password
        });
      //guardar usuario
      newUser.save( (err) => {
        if (err) {
          return res.status(400).json({ message: 'El correo ya existe' });
        }
        res.status(201).json({ message: 'Usuario registrado con éxito.' });
        });
      }
    }
    else {
      res.status(400).json({ message: 'Ingrese un correo válido.' });
    }
  }

  existEmail(req, res){
    //Example validate
    validateUser(req.body, true)
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

  googleNative(req, res){
    validateGoogle(req.body)
      .then(({errors, isValid, user, token}) => {
        if(isValid){
          const token = jwt.sign(user, mongo.secret, {
            expiresIn: 10000 //segundos
          });
          return res.status(200).json({user: user, token: `JWT ${token}`});
        }
        else{
          return res.status(400).json(errors)
        }
      })
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
  deviceSignin(req, res) {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) throw (err);

      if(!user) {
        res.status(401).json({ message: 'Fallo en la autenticación. Usuario no registrado.' });
      } else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            var token = jwt.sign(user, mongo.secret, {
              expiresIn: 10000 //segundos
            });
            var data = {
              token: 'JWT ' + token,
              user: req.user,
            }
            res.status(201).json({ data: data });
          } else {
            res.status(401).json({ message: 'Fallo en la autenticación. La clave no coincide.' });
          }
        });
      }
    });
  }
}

export default AuthController;
