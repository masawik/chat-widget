import {REQUEST_CLEAR_STATUS, REQUEST_SUCCESS, REQUEST_START, REQUEST_ERROR} from "../actions/actionTypes";

const initialState = null

export default function requestStatus(state = initialState, action) {
  switch (action.type) {
    case REQUEST_START:
      return REQUEST_START
    case REQUEST_SUCCESS:
      return REQUEST_SUCCESS
    case REQUEST_ERROR:
      return REQUEST_ERROR
    case REQUEST_CLEAR_STATUS:
      return null
    default:
      return state
  }
}