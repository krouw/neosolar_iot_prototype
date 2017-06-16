import mongoose from 'mongoose'
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

//Quita los atributos de las consultas

DeviceSchema.method('toJSON', function() {
  let device = this.toObject();
  delete device.salt;
  delete device.hash;
  delete device.__v;
  delete device.password;
  return device;
});

export default mongoose.model('Device', DeviceSchema)
