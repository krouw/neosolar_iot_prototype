import { SET_DEVICES, START_FETCHING_DEVICES } from '../actions/types'

const initialState = {
  devices: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_DEVICES:
      return {
        devices: action.devices,
        ...state,
      }
    case START_FETCHING_DEVICES:
      return {
        isFetching: true,
        ...state
      }
    default:
        return state;
  }
}
