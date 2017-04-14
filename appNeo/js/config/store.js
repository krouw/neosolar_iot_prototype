import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import { createLogger } from 'redux-logger'
import { AsyncStorage } from 'react-native'
import rootReducer from '../reducers'

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  undefined,
  compose(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware),
    autoRehydrate(),
  ),
);

persistStore(store, { storage: AsyncStorage, blacklist: ['form', 'auth'] }, () => {

})

export default store;
