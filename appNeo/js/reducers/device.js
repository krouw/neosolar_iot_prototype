import { SET_DEVICES, START_FETCHING_DEVICES, START_FETCHING_MEASUREMENT } from '../actions/types'

const initialState = {
  devices: [],
  isFetching: false,
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_DEVICES:
      return Object.assign({}, state, {
          devices: action.devices,
          isFetchingDevice: false
        })
    case START_FETCHING_DEVICES:
      return Object.assign({}, state, {
          isFetchingDevice: true
        })
    case START_FETCHING_MEASUREMENT:
      return Object.assign({}, state, {
          isFetchingMeasurement: true
        })
    default:
        return state;
  }
}
