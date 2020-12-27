import {SERVER_UNAVAILABLE, SET_SERVER_STATUS} from "../actions/actionTypes";

const initialState = null

export default function serverStatus(state = initialState, action) {
  switch (action.type) {
    case SET_SERVER_STATUS:
      return action.payload
    default:
      return state
  }
}