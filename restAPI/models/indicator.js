import mongoose from 'mongoose'
import { INDICATOR_KWH } from '../config/config'

const Schema = mongoose.Schema

const IndicatorSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [ INDICATOR_KWH ],
    required: true
  },
  value: {
    type: Number,
    required: true,
  },
},{ timestamps: true });


//Quita los atributos de las consultas

IndicatorSchema.method('toJSON', function() {
  let indicator = this.toObject();
  delete indicator.__v;
  delete indicator.password;
  return indicator;
});

export default mongoose.model('Indicator', IndicatorSchema)
