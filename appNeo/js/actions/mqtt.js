import { Client, Message } from 'react-native-paho-mqtt';
import { mqttServer } from '../config/mqtt'
import { setMeasurement } from './device'
import { MQTT_CONNECTED, MQTT_SUBSCRIBE, MQTT_MESSAGE, MQTT_CONSUME } from '../actions/types'
import { ToastAndroid } from 'react-native'

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

export function setConnection(){
  return {
    type: MQTT_CONNECTED,
    value: true
  }
}

export function removeConnection(){
  return {
    type: MQTT_CONNECTED,
    value: false
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
        dispatch(removeConnection())
        client.disconnect()
        ToastAndroid.show('Problemas para acceder al Servidor', ToastAndroid.LONG);
      }
    });
    client.on('messageReceived', (message) => {

      if(message._destinationName.split('/')[1] && message.payloadString){
        let msm = JSON.parse(message.payloadString)
        let device = message._destinationName.split('/')[1]
        dispatch(setMeasurement({ _id: device }, msm.d))
      }
    });

    client.connect({ userName: config.username, password: config.password })
      .then(() => {
        dispatch(setConnection())
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
