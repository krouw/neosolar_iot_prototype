import { Client, Message } from 'react-native-paho-mqtt';
import { mqttServer } from '../config/mqtt'
import { setMeasurement } from './device'
import { MQTT_CONNECTED, MQTT_SUBSCRIBE, MQTT_MESSAGE, MQTT_CONSUME } from '../actions/types'
import { ToastAndroid } from 'react-native'
import { isJSON } from '../util/isJSON'

const MEASUREMENT = 'MEASUREMENT'

let client

const myStorage = {
  setItem: (key, item) => {
    myStorage[key] = item;
  },
  getItem: (key) => myStorage[key],
  removeItem: (key) => {
    delete myStorage[key];
  },
};

export function Connection(value){
  return {
    type: MQTT_CONNECTED,
    value: value
  }
}

export const mqttConnect = (config, devices) => {
  return dispatch => {
    if (config.mqttActive) {
      return;
    }
    const client = new Client({ uri: mqttServer.url, clientId: config.clientId, storage: myStorage });
    // set event handlers
    client.on('connectionLost', (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
        dispatch(Connection(false))
        client.disconnect()
        ToastAndroid.show('Problemas para acceder al Servidor', ToastAndroid.LONG);
      }
    });
    client.on('messageReceived', (message) => {
      if(message.destinationName.split('/')[1] && isJSON(message.payloadString)){
        const payload = JSON.parse(message.payloadString)
        switch (payload.type) {
          case MEASUREMENT:
            let device = message._destinationName.split('/')[1]
            dispatch(setMeasurement({ _id: device }, payload.data))
            break;
          default:
            console.log('Sin Acciones');
        }
      }
    });

    client.connect({ userName: config.username, password: config.password })
      .then(() => {
        dispatch(Connection(true))
        return
      })
      .then(() => {
        Object.keys(devices)
          .map( deviceKey => {
            return client.subscribe('device/'+deviceKey)
          })
      })
      .catch((err) => {
        ToastAndroid.show('Problemas para acceder al Servidor', ToastAndroid.LONG);
      })

  }
}
