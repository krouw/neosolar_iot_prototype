import { SET_DEVICE,
         SET_MEASUREMENT,
         START_FETCHING_DEVICES,
         START_FETCHING_MEASUREMENT } from '../actions/types'

const initialState = {
  entities: {},
  isFetchingDevice: false,
  isFetchingMeasurement: false,
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_DEVICE:
      if(action.device){
        const newDevice = Object.assign({}, state.entities)
        newDevice[action.device._id] = action.device
        return Object.assign({}, state, {
            entities: newDevice,
            isFetchingDevice: false
          })
      }
      else{
        return Object.assign({}, state, {
            entities: {},
            isFetchingDevice: false
          })
      }
    case START_FETCHING_DEVICES:
      return Object.assign({}, state, {
          isFetchingDevice: true
        })
    case START_FETCHING_MEASUREMENT:
      return Object.assign({}, state, {
          isFetchingMeasurement: true
        })
    case SET_MEASUREMENT:
      const newDevices = Object.assign({}, state.entities)
      newDevices[action.device._id].measurement = action.msm
      return Object.assign({}, state, {
          entities: newDevices,
          isFetchingMeasurement: false
        })
    default:
        return state;
  }
}
