const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
import jwt from 'jsonwebtoken';
import { SECRET } from '../config/config';
import { ROLE_DEVICE, ROLE_ADMIN, ROLE_CLIENT, ROLE_MANAGER } from './roles'

import User from '../models/user'
import Device from '../models/device'

// load the auth variables
import { socialAuth } from './socialAuth'

module.exports = (passport) => {

    // code for login (use('local-login', new LocalStategy))
    var opts = {};
   // revisa los headers
   opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
   opts.secretOrKey = SECRET.secret;
   passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
     var id = jwt_payload.sub
     console.log(jwt_payload);
     if( jwt_payload.role === ROLE_DEVICE ){
       Device.findOne({_id: id})
        .then((device) => {
          if(device){
            return done(null, device)
          }
          else{
            return done(null, false)
          }
        })
        .catch((err) => {
          return done(err, false)
        })
     }

     if( jwt_payload.role === ROLE_CLIENT ||
         jwt_payload.role === ROLE_MANAGER ||
         jwt_payload.role === ROLE_ADMIN ) {

       User.findOne({_id: id})
        .then((user) => {
          if(user){
            return done(null, user)
          }
          else{
            return done(null, false)
          }
        })
        .catch((err) => {
          return done(err, false)
        })
     }

    }));

    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : socialAuth.googleAuth.clientID,
        clientSecret    : socialAuth.googleAuth.clientSecret,
        callbackURL     : socialAuth.googleAuth.callbackURL,

    }, (token, refreshToken, profile, jwt_payload, done) => {

        const { id, emails } = jwt_payload;
        const googleid = { id: id };

        // try to find the user based on their google id
        User.findOne({ 'google.id' : id })
          .then( user => {
            if(user){
              return done(null , user)
            }
            else{
              User.create({
                email: emails[0].value,
                google: googleid,
                password: id })
                .then( userCreate => {
                  return done(null , userCreate)
                })
                .catch( err => {
                  return done('El Email ya está siendo utilizado')
                })
            }
          })
          .catch( err => {
            return done('Problemas con el servidor')
          })
    }));
};
