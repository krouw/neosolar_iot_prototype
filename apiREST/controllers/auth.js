import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

import User from '../models/user';
import { mongo } from '../config/config';

class AuthController {

  signin(req, res) {
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
            res.json({ success: true, token: 'JWT '+ token, user: user.email});
          } else {
            res.send({ success: false, message: 'Fallo en la autenticación. La clave no coincide.'});
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
}

export default AuthController;
