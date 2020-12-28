import {HIDE_ALERT, SHOW_ALERT} from "../actions/actionTypes";

const initialState = {}

export default function alert(state = initialState, action) {
  switch (action.type) {
    case (SHOW_ALERT):
      return {...state, [action.payload.id]: action.payload.info}
    case (HIDE_ALERT):
      const newState = {...state}
      delete newState[action.payload]
      return newState
    default: return state
  }
}