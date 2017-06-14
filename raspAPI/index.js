import mqtt from 'mqtt'
import acquisition from './fakeMeter'
import { id, password, api } from './config/config'
import { persist } from './persist'
import { auth } from './auth/auth'

const bodyAuth = {
  id: id,
  password: password,
}

const message = (client, payload) => {
  client.publish(`device/alice`, payload, err => {
    if(err)
      console.log(err);
  })
}

const subscribe = () => {
  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(topic + ' --> ' + message.toString() );
    //client.end()
  })
}

const initMeter = () => {
  const client = mqtt.connect('mqtt://localhost:1883', { username: 'alice', password: 'secret' })
  client.on('message', function(topic, message) {
    console.log(topic + ' - ' + message);
  })

  client.subscribe('device/alice')
  setInterval(() => {
       acquisition()
        .then(({msm}) => {
          //console.log(msm);
          message(client, JSON.stringify(msm))
          //persist(msm)
        })
        .catch((err) => {
          console.log('Error acquisition ' + err);
        })
  }, 10000)
}

const bootstrap = () => {
  auth(bodyAuth)
    .then((value) => {
      initMeter()
    })
    .catch((err) => {
      console.log('Error Auth' + err.response.data);
    })
}

bootstrap()
