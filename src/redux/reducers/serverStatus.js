import {SERVER_CONNECTING, SERVER_OK, SERVER_UNAVAILABLE} from "../actions/actionTypes";

const initialState = null

export default function serverStatus(state = initialState, action) {
  switch (action.type) {
    case SERVER_CONNECTING:
      return SERVER_CONNECTING
    case SERVER_OK:
      return SERVER_OK
    case SERVER_UNAVAILABLE:
      return SERVER_UNAVAILABLE
    default:
      return state
  }
}