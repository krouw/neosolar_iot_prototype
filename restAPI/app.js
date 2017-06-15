import express from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan'
import mongoose from 'mongoose'
import passport from 'passport'
import kue from 'kue'
import { createFecthKWh } from './queue/indicator'
import { MONGO } from './config/config'
import routesBinder from './libs/Route'
const app = express()

const database  = process.env.MONGO_URL || MONGO.uri

mongoose.Promise = global.Promise; //mongoose uso de promesas es6
mongoose.connect(database);

//bootstrap
function bootstrap() {
  createFecthKWh( err => {
    if(err)
      console.log(err);
  })
}

//bootstrap()

//Middlewares

  //bodyParser json y form
app.use(logger('dev'))
app.use(passport.initialize())
require('./config/passport')(passport);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/kue', kue.app)

app.get('/api', (req,res) => {
  res.send('NeoSolar API REST');
})

routesBinder(app)

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Lo Sentimos, no hemos encontrado este recurso.'
  });
})

export default app;
