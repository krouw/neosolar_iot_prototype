import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../models/user'
import arrayUniquePlugin from 'mongoose-unique-array'
import { ROLE_DEVICE } from '../config/roles'

const Schema = mongoose.Schema

const DeviceSchema = new mongoose.Schema({
  name: {
    type:  String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  role :{
    type: String,
    default: ROLE_DEVICE,
  },
  location: {
    type: String,
  },
  coordenadas: {
    type: Array,
  },
  battery: {
    type: Object,
  },
  state: {
    type: String,
    default: 'active'
  },
  forecast: {
    type: Object,
  },
  users: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
},{ timestamps: true });

DeviceSchema.plugin(arrayUniquePlugin)

//Quita los atributos de las consultas

DeviceSchema.method('toJSON', function() {
  let device = this.toObject();
  delete device.salt;
  delete device.hash;
  delete device.__v;
  delete device.password;
  return device;
});

DeviceSchema.pre('save', function(next){
  var device = this;
  if (this.isModified('password') || this.isNew){
    bcrypt.genSalt(10, function(err, salt){
      if (err) {
        return next(err);
      }
      bcrypt.hash(device.password, salt, function(err,hash){
        if (err) {
          return next(err);
        }
        device.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

DeviceSchema.pre('remove', function(next) {
    // Remove all the assignment docs that reference the removed Device.
    this.model('User').remove({ devices: this._id }, next);
});

export default mongoose.model('Device', DeviceSchema)
