import axios from 'axios'
import { SubmissionError, reset } from 'redux-form'
import { ToastAndroid } from 'react-native'
import { SET_DEVICE,
         SET_MEASUREMENT,
         FETCHING_DEVICES,
         START_FETCHING_ADD_DEVICES,
         START_FETCHING_MEASUREMENT, api } from './types'

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

export const FetchingDevices = (state) => {
    return {
      type: FETCHING_DEVICES,
      fetchingDevices: state
    }
};

export const startFetchingMeasurement = () => {
    return {
      type: START_FETCHING_MEASUREMENT,
    }
};

export const startFetchingAddDevice = () => {
  return {
    type: START_FETCHING_ADD_DEVICES,
  }
}

export const addUserDevice = (user, data) => {
  return dispatch => {
    dispatch(startFetchingAddDevice())
    return axios.post(`${api.uri}/user/${user._id}/device/`, data)
            .then((value) => {
              console.log(value);
            })
            .catch((err) => {
              console.log(err.response);
              if(!err.response){
                ToastAndroid.show('No se ha podido establecer conexión con el Servidor', ToastAndroid.LONG);
              }
              if(err.response){
                if(err.response.status === 400 || err.response.status === 404 || err.response.status === 403){
                  throw new SubmissionError(err.response.data.errors)
                }
                if(err.response.status === 500){
                  ToastAndroid.show(err.response.data.errors._error, ToastAndroid.LONG);
                }
              }
            })
  }
}

export const getUserDevices = data => {
  return dispatch => {
    dispatch(FetchingDevices(true))
    return axios.get(`${api.uri}/user/${data._id}/device/`)
            .then((value) => {
              if(value.data.data.devices.length <= 0){
                return
              }
              else{
                value.data.data.devices.forEach( device => {
                  dispatch(setDevice(device))
                })
              }
            })
            .then(() => {
              dispatch(FetchingDevices(false))
            })
            .catch((err) => {
              console.log(err.response);
              dispatch(FetchingDevices(false))
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
