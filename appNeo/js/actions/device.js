import axios from 'axios'
import { SET_DEVICES,
         START_FETCHING_DEVICES, START_FETCHING_MEASUREMENT, api } from './types'

export const setDevices = (devices) => {
  return {
    type: SET_DEVICES,
    devices: devices,
  }
}

export const startFetchingDevices = () => {
    return {
      type: START_FETCHING_DEVICES,
    }
};

export const startFetchingMeasurement = () => {
    return {
      type: START_FETCHING_MEASUREMENT,
    }
};


export const getUserDevices = data => {
  return dispatch => {
    dispatch(startFetchingDevices())
    return axios.get(`${api.uri}/user/${data._id}/device/`)
            .then((value) => {
              dispatch(setDevices(value.data.data.devices))
            })
            .catch((err) => {
              console.log(err.response);
            })
  }
}

export const getDeviceMeasurement = data => {
  return dispatch => {
    dispatch(startFetchingMeasurement())
  }
}
