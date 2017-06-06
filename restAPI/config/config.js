export const express = {
  port: process.env.PORT || 7000,
  ssl: process.env.HTTPS_PORT || 9999
}

export const MONGO = {
  uri: "mongodb://localhost/apineo",
  secret: "secret"
}

let kWh = {
  value: 0,
  updateAt: Date.now()
}

export const setkWh = (data) => {
  console.log(data);
  Object.assign(kWh, data);
  console.log(kWh);
  return
}
