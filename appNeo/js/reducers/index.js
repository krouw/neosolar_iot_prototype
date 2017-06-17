import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import auth from './auth'
import device from './device'
import mqtt from './mqtt'

const rootReducer = combineReducers({
  auth,
  form: formReducer,
  mqtt,
  device,
});

export default rootReducer;
