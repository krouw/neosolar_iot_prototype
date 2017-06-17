import isEmpty from 'lodash/isEmpty'
import { SET_CURRENT_USER, SET_TOKEN } from '../actions/types'

const initialState = {
  isAuthenticated: false,
  token: '',
  user: {}
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return Object.assign({}, state, {
              isAuthenticated: !isEmpty(action.user),
              user: action.user,
             })
     case SET_TOKEN:
       return Object.assign({}, state, {
                token: action.token
              })
    default:
        return state;
  }
}
