import axios from 'axios'
import { SET_DEVICES, START_FETCHING_DEVICES, api } from './types'

export const setDevices = (devices) => {
  return {
    type: SET_DEVICES,
    devices: devices,
  }
}

export const startFetchingMessages = () => {
    return {
      type: 'START_FETCHING_DEVICES'
    }
};


export const getUserDevices = data => {
  return dispatch => {
    dispatch(startFetchingMessages())
    return axios.get(`${api.uri}/user/${data._id}/device/`)
            .then((value) => {
              dispatch(setDevices(value.data.data.devices))
            })
            .catch((err) => {
              console.log(err.response);
            })
  }
}
