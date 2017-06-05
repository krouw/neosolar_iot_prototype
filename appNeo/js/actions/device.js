import axios from 'axios'
import { SET_DEVICES } from './types'

const setDevices = (devices) => {
  return {
    type: SET_DEVICES,
    devices: devices,
  }
}

const getUserDevices = data => {
  console.log(data);
  return dispatch => {
    return axios.get(`${api.uri}/user/${data.id}/device/`)
            .then((value) => {
              console.log(value);
            })
            .catch((err) => {
              console.log(err);
            })
  }
}

export { getUserDevices, setDevices }
