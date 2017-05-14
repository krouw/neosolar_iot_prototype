export const express = {
  port: process.env.PORT || 7000,
  ssl: process.env.HTTPS_PORT || 9999
}

export const MONGO = {
  uri: "mongodb://localhost/apineo",
  secret: "secret"
}

const ROLE_CLIENT = 'Client',
  ROLE_DEVICE = 'Device',
  ROLE_MANAGER = 'Manager',
  ROLE_ADMIN = 'Admin'

export { ROLE_CLIENT, ROLE_DEVICE, ROLE_MANAGER, ROLE_ADMIN }
