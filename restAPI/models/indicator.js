import mongoose from 'mongoose'
import { INDICATOR_KWH } from '../config/config'

const Schema = mongoose.Schema

/*
*  INDICATOR   ID
*  pricekWh:  1
*
*
*/

const IndicatorSchema = new mongoose.Schema({
  id: {
    type: Number,
    enum: [ INDICATOR_KWH.id, ]
  },
  name: {
    type: String,
    enum: [ INDICATOR_KWH.name ],
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
