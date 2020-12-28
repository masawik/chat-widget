import {HIDE_ALERT, SHOW_ALERT} from "../actions/actionTypes";

const initialState = {
  visible: false,
  message: null
}

export default function alert(state = initialState, action) {
  switch (action.type) {
    case (SHOW_ALERT):
      return {visible: true, message: action.payload}
    case (HIDE_ALERT):
      return {...state, visible: false}
    default: return state
  }
}