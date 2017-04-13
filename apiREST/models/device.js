import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const DeviceSchema = new mongoose.Schema({
  idUser: {
    type: String,
    required:true,
  },
  name: {
    type:  String,
    required: true,
  },
  location: {
    type: String,
  },
  coordenadas: {
    type: String,
  },
  batery: {
    type: Object,
  },
  state: {
    type: String,
  }
},{ timestamps: true });

//Quita los atributos de las consultas

DeviceSchema.method('toJSON', function() {
  let device = this.toObject();
  delete device.salt;
  delete device.hash;
  delete device.__v;
  return device;
});

export default mongoose.model('Device', DeviceSchema)
