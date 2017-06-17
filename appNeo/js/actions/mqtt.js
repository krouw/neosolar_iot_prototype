import { Client, Message } from 'react-native-paho-mqtt';
import { mqttServer } from '../config/mqtt'
import { GetStorage, InsertStorage, DeleteStorage } from '../util/AsyncStorage'
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

export const mqttConnect = config => {
  return dispatch => {
    if (config.mqttActive) {
      return;
    }
    const client = new Client({ uri: mqttServer.url, clientId: config.clientId, storage: myStorage });
    client.connect({ userName: config.username, password: config.password })
      .then((value) => {
        console.log('Valid: ', value);
      })
      .catch((err) => {
        console.log('Error: ', err);
      })

  }
}
