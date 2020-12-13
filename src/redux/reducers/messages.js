import {ADD_MSG, SET_MSGS} from "../actions/actionTypes";

const initialState = []


export default function messages(state = initialState, action) {
  switch (action.type) {
    case ADD_MSG:
      return [...state, action.payload]
    case SET_MSGS:
      return action.payload
    default:
      return state
  }
}