import { SET_DEVICES } from '../actions/types'

const initialState = {
  devices: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_DEVICES:
    console.log(!isEmpty(action.devices));
      return {
        devices: action.devices,
        ...state,
      }
    default:
        return state;
  }
}
