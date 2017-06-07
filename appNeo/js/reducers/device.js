import { SET_DEVICES, START_FETCHING_DEVICES } from '../actions/types'

const initialState = {
  devices: [],
  isFetching: false,
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_DEVICES:
      return Object.assign({}, state, {
          devices: action.devices,
          isFetching: false
        })
    case START_FETCHING_DEVICES:
      return Object.assign({}, state, {
          isFetching: true
        })
    default:
        return state;
  }
}
