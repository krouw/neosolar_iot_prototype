import mongoose from 'mongoose'
import { ROLE_CLIENT, ROLE_MANAGER, ROLE_ADMIN } from '../config/roles'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowecase: true,
    unique: true,
    required:true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [ROLE_CLIENT, ROLE_MANAGER, ROLE_ADMIN],
    default: ROLE_CLIENT,
  },
  google: {
    type: Object,
  },
  refreshToken: {
    type: String
  },
  devices: [{
    type: mongoose.Schema.ObjectId,
    ref: "Device"
  }],
},{ timestamps: true });


//Quita los atributos de las consultas

UserSchema.method('toJSON', function() {
  let user = this.toObject();
  delete user.salt;
  delete user.hash;
  delete user.__v;
  delete user.password;
  delete user.refreshToken;
  return user;
});

export default mongoose.model('User', UserSchema)
