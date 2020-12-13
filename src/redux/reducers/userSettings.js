import {SET_USER_SETTINGS} from "../actions/actionTypes";

const initialState = {
  username: null,
  color: null
}

export default function userSettings(state = initialState, action) {
  switch (action.type) {
    case SET_USER_SETTINGS:
      return action.payload
    default:
      return state
  }
}