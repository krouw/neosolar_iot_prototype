import { SET_DEVICE,
         SET_MEASUREMENT,
         FETCHING_DEVICES,
         START_FETCHING_MEASUREMENT,
         START_FETCHING_ADD_DEVICES, } from '../actions/types'

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

    case FETCHING_DEVICES:
      return Object.assign({}, state, {
          isFetchingDevice: action.fetchingDevices
        })

    case START_FETCHING_MEASUREMENT:
      return Object.assign({}, state, {
          isFetchingMeasurement: true
        })

    case START_FETCHING_ADD_DEVICES:
      return Object.assign({}, state, {
        isFetchingAddDevice: true
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
