import mongoose from 'mongoose'
import Device from '../models/device'

const Schema = mongoose.Schema

const MeasurementSchema = new mongoose.Schema({
  intensity: {
    type:  String,
    required: true
  },
  voltageTotal: {
    type: String,
    required: true
  },
  battery: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  } ,
  device:{ type: Schema.ObjectId, ref: "Measurement"},
});

//Quita los atributos de las consultas

MeasurementSchema.method('toJSON', function() {
  let measurement = this.toObject();
  delete measurement.salt;
  delete measurement.hash;
  delete measurement.__v;
  return measurement;
});

export default mongoose.model('Measurement', MeasurementSchema)
