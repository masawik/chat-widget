import {ADD_MSG} from "../actions/actionTypes";

const initialState = [
  {
    id: 'firstMessage',
    from: 'я сам',
    msg: 'привет это же я сам ты чего, не узнал?'
  },
]


export default function messages(state = initialState, action) {
  switch (action.type) {
    case ADD_MSG:
      return [...state, action.payload]
    default:
      return state
  }
}