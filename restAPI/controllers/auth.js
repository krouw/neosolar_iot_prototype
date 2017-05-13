import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';
import GoogleAuth from 'google-auth-library'

import User from '../models/user';
import Device from '../models/device';
import { socialAuth } from '../config/socialAuth'
//import { authDevice } from '..config/config'
import { mongo } from '../config/config';
import { auth } from '../config/config'

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
    if (isEmpty(data.password)) {
      errors.password = 'Campo Requerido'
    }
    else if (data.password.length<6 || data.password.length>20 ) {
      errors.password = 'Contraseña de 6 a 20 caracteres'
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

function validateByGoole(errors, data){

  const promise = new Promise( (resolve, reject) => {

    const auth = new GoogleAuth;
    const client = new auth.OAuth2(socialAuth.clientID, '', '');

    if(!isEmpty(errors)){
      return resolve({
        errors,
        isValid: isEmpty(errors)
      })
    }
    else{
      client.verifyIdToken(data.idToken, socialAuth.clientID, (err, login) => {
        let errors = {}
        if(err){
          errors.google = 'Problemas de validación con Google'
          return resolve({
            errors,
            isValid: isEmpty(errors)
          })
        }
        const payload = login.getPayload();
        return resolve({
          userid: {id: payload['sub']},
          isValid: isEmpty(errors),
          errors,
        });
      })
    }
  })
  return promise;
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
    errors.idToken = 'Campo Requerido'
  }

  return validateByGoole(errors, data)
          .then(({errors, isValid, userid}) => {
            return {
              errors: errors,
              isValid: isEmpty(errors),
              userid: userid,
            }
          })
}

class AuthController {

  signin(req, res) {
    //TODO implementar promesas then-catch en find y create
    let validate = validateUser(req.body)
    if (validate.isValid) {
      //Promesa findOne
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
              res.status(200).json({ token: 'JWT '+ token, user: user});
            } else {
              res.status(401).json({ message: 'Fallo en la autenticación. La clave no coincide.'});
            }
          });
        }
      });
    }
  }

  signup(req, res){
    let data = req.body;
    let errors = {};
    let isValid = true;
    //validator.email sin un string devuelve err server
    if(isEmpty(data.email)){
      errors.email = 'Campo Requerido'
      isValid = false;
    }
    else if (!validator.isEmail(data.email)) {
      errors.email = 'Email inválido'
      isValid = false;
    }

    if(isEmpty(data.id)){
      errors.id = 'Campo Requerido'
      isValid = false;
    }

    if(isEmpty(data.idToken)){
      errors.idToken = 'Campo Requerido'
      isValid = false;
    }

    if(isValid){
      User.findOne({ 'email' : data.email })
        .then( user => {
          if(user){
            if(user.email === data.email){
              errors.email = 'Este email está siendo utilizado por un usuario'
              res.status(400).json({errors: errors, isValid: false})

            }
          }
          else {
            let newUser = new User({
                email: data.email,
                password: data.password
            });
            const token = jwt.sign(newUser._id, mongo.secret, {
              expiresIn: 10000 //segundos
            });
            newUser.save( (err) => {
              if (err) {
                return res.status(400).json({ message: 'El correo ya existe', errors: errors, isValid: false });
              }
              else {
                return res.status(200).json({ message: 'Usuario registrado con éxito.', errors: {}, isValid: true, token: token});
              }

            });
          }
        })
    }
    else {
      res.status(400).json({ message: 'Los datos entregados no son válidos.', errors: errors });
  }
}

  existEmail(req, res){
   //Example validate
   if(!req.params.email){
     return res.status(400).json({status: 'Error', errors: {email: 'Campo Requerido'}});
   }

   if(!validator.isEmail(req.params.email)){
     return res.status(400).json({status: 'Error', errors: {email: 'El Campo debe ser un email'}});
   }

   User.findOne({ 'email' : req.params.email })
     .then( user => {
       if(user){
         return res.status(200).json({errors: {email: 'Este Correo ya está siendo utilizado'}, status: 'Error'});
       }
       return res.status(200).json({status: 'OK'});
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
      .then(({errors, isValid, userid}) => {
        if(isValid){
          User.findOne({ 'google.id' : userid.id })
            .then( user => {
              if(user){
                const token = jwt.sign(user, mongo.secret, {
                      expiresIn: 10000 //segundos
                });
                return res.status(200).json({user: user, token: `JWT ${token}`});
              }
              else{
                User.create({
                  email: res.body.email,
                  google: userid,
                  password: id })
                  .then( userCreate => {
                    const token = jwt.sign(user, mongo.secret, {
                          expiresIn: 10000 //segundos
                    });
                    return res.status(201).json({user: user, token: `JWT ${token}`});
                  })
                  .catch( err => {
                    return res.status(400).json({
                      errors: {email: 'Este Email ya está siendo utilizado'}
                      , status: 'Error'})
                  })
              }
            })
        }
        else{
          return res.status(400).json({errors: errors, status: 'Error'})
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
              secret: auth.secret,
            }
            res.status(200).json({ data: data });
          } else {
            res.status(400).json({ message: 'Fallo en la autenticación. La clave no coincide.' });
          }
        });
      }
    });
  }
}

export default AuthController;
