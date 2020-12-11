import {ADD_MSG, FINISH_SENDING, SENDED, START_SENDING} from "./actionTypes";
import {getUniqueId} from "../../utils/utils";


const startSend = () => ({type: START_SENDING})
const sended = () => ({type: SENDED})
const finishSend = () => ({type: FINISH_SENDING})

export function addMsg(id, from, msg) {
  return {
    type: ADD_MSG,
    payload: {
      id,
      from,
      msg
    }
  }
}

export function sendMsg(msg) {
  return dispatch => {
    dispatch(startSend())
    setTimeout(()=> {
      // тут отправка сообщения на сервер
      const id = getUniqueId()
      dispatch(sended())
      dispatch(addMsg(id, 'я сам асинхронный', msg))

      dispatch(finishSend())
    }, 2000)
  }
}