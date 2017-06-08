import axios from 'axios'
import { SET_DEVICE,
         SET_MEASUREMENT,
         START_FETCHING_DEVICES, START_FETCHING_MEASUREMENT, api } from './types'

export const setDevice = (device) => {
  return {
    type: SET_DEVICE,
    device: device,
  }
}

export const setMeasurement = (device, msm) => {
  return {
    type: SET_MEASUREMENT,
    device: device,
    msm: msm,
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
              if(value.data.data.devices.length <= 0){
                dispatch(setDevice())
              }
              else{
                value.data.data.devices.forEach( device => {
                  dispatch(setDevice(device))
                })
              }
            })
            .catch((err) => {
              console.log(err.response);
            })
  }
}

export const getDeviceMeasurement = data => {
  return dispatch => {
    dispatch(startFetchingMeasurement())
    return axios.get(`${api.uri}/device/${data._id}/measurement/now`)
      .then((value) => {
        if(value.data.data.measurement.length > 0){
          dispatch(setMeasurement(value.data.data.device, value.data.data.measurement[0]))
        }
        else {
          dispatch(setMeasurement(value.data.data.device, {}))
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
}

export const updateDeviceMeasurement = data => {
  return dispatch => {
    return setInterval(() => {
      axios.get(`${api.uri}/device/${data._id}/measurement/now`)
        .then((value) => {
          if(value.data.data.measurement.length > 0){
            dispatch(setMeasurement(value.data.data.device, value.data.data.measurement[0]))
          }
          else {
            dispatch(setMeasurement(value.data.data.device, {}))
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }, 5000)
  }
}
