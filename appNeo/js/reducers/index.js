import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import auth from './auth'
import device from './device'

const rootReducer = combineReducers({
  auth,
  form: formReducer,
  device,
});

export default rootReducer;
