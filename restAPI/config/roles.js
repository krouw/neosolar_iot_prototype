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

const UserDeviceRole = (req) => {
  //Falta
}


const AdminRole = (req) => {
  if (req.user.role === ROLE_ADMIN) {
    return true;
  }
}

export { ROLE_CLIENT, ROLE_DEVICE, ROLE_MANAGER, ROLE_ADMIN }
export { UserRole, UserDeviceRole, AdminRole }
