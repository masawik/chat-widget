import {CLEAR_REPLY_PURPOSE, SET_REPLY_PURPOSE} from "../actions/actionTypes";

const initialState = null


export default function replyPurpose(state = initialState, action) {
  switch (action.type) {
    case SET_REPLY_PURPOSE:
      return action.payload
    case CLEAR_REPLY_PURPOSE:
      return null
    default:
      return state
  }
}