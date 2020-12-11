import {FINISH_SENDING, SENDED, START_SENDING} from "../actions/actionTypes";

const initialState = null

export default function status(state = initialState, action) {
  switch (action.type) {
    case START_SENDING:
      return START_SENDING
    case SENDED:
      return SENDED
    case FINISH_SENDING:
      return null
    default:
      return state
  }
}