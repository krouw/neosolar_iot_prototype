import isEmpty from 'lodash/isEmpty'
import { MQTT_CONNECTED, MQTT_SUBSCRIBE, MQTT_MESSAGE, MQTT_CONSUME } from '../actions/types'

const initialState = {
  mqttActive: false,
  pinged: { }
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case MQTT_CONNECTED:
      return Object.assign({}, state, {
              mqttActive: action.value
             })
    default:
        return state;
  }
}
