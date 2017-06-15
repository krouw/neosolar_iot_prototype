import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose';

const ROLE_CLIENT = 'Client',
  ROLE_DEVICE = 'Device',
  ROLE_MANAGER = 'Manager',
  ROLE_ADMIN = 'Admin'

const UserRole = (req) => {
  if(req.params.idUser == req.user._id && (req.user.role === ROLE_CLIENT || req.user.role === ROLE_MANAGER)){
    return true;
  }

  if (req.user.role === ROLE_ADMIN) {
    return true;
  }
}

const AdminRole = (req) => {
  if (req.user.role === ROLE_ADMIN) {
    return true;
  }
}

const AdminMaganerRole = (req) => {
  if (req.user.role === ROLE_ADMIN || req.user.role === ROLE_MANAGER) {
    return true;
  }
}

const UserDeviceRole = (req) => {

  if(!mongoose.Types.ObjectId.isValid(req.params.idDevice)){
    return true
  }

  if(req.user.role === ROLE_ADMIN || req.user.role === ROLE_MANAGER){
    return true
  }

  if(req.user.role === ROLE_CLIENT){
    const checkUser = req.user.devices.filter( device => {
        let aux = device.toString()
        return aux == req.params.idDevice
    })
    if(!isEmpty(checkUser)){
      return true
    }
    else{
      return false
    }
  }

}

const deviceRole = (req) => {
  if(req.user.role === ROLE_ADMIN || req.user.role === ROLE_MANAGER){
    return true
  }

  if (req.user.role === ROLE_DEVICE && req.user._id == req.params.idDevice) {
    return true;
  }
}

export { ROLE_CLIENT, ROLE_DEVICE, ROLE_MANAGER, ROLE_ADMIN }
export { UserRole, AdminRole, UserDeviceRole, AdminMaganerRole, deviceRole }
