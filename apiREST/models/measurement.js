import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import Device from '../models/device'

const Schema = mongoose.Schema

const MeasurementSchema = new mongoose.Schema({
  idDevice: {
    type: String,
    required:true,
  },
  intensity: {
    type:  String,
  },
  voltage: {
    type: String,
  },
  device:{ type: Schema.ObjectId, ref: "Measurement"},
},{ timestamps: true });

//Quita los atributos de las consultas

MeasurementSchema.method('toJSON', function() {
  let measurement = this.toObject();
  delete measurement.salt;
  delete measurement.hash;
  delete measurement.__v;
  return measurement;
});

export default mongoose.model('Measurement', MeasurementSchema)
