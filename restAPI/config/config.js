export const express = {
  port: process.env.PORT || 7000,
  ssl: process.env.HTTPS_PORT || 9999
}

export const MONGO = {
  uri: "mongodb://localhost/apineo"
}

export const SECRET = {
  secret: "secret"
}

const AUDIENCE_CLIENT = 'Client',
      AUDIENCE_DEVICE = 'Device';

//Indicator const
export const INDICATOR_KWH = 'INDICATOR_KWH'
export const INDICATOR_KWH_DELAY = 86400000*3; //delay 3 dias

export { AUDIENCE_DEVICE, AUDIENCE_CLIENT }
