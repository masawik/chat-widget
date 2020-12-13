import {UPDATE_ONLINE_COUNTER} from "../actions/actionTypes";

const initialState = 0

export default function chatUsersCounter (state = initialState, action) {
  switch (action.type) {
    case (UPDATE_ONLINE_COUNTER):
      return action.payload
    default: return state
  }
}