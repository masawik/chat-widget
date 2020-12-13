import {
  ADD_MSG,
  FINISH_SENDING,
  SENDED,
  SET_MSGS,
  SET_USER_SETTINGS,
  START_SENDING,
  UPDATE_ONLINE_COUNTER
} from "./actionTypes";
import io from 'socket.io-client'
import axios from 'axios'

let socket

const startSend = () => ({type: START_SENDING})
const sended = () => ({type: SENDED})
const finishSend = () => ({type: FINISH_SENDING})
const setUserSettings = settings => ({type: SET_USER_SETTINGS, payload: settings})
const updateChatOnlineCounter = val => ({type: UPDATE_ONLINE_COUNTER, payload: val})

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
export function setMsgs(msgs) {
  return {
    type: SET_MSGS,
    payload: msgs
  }
}

export function sendMsg(msg) {
  return dispatch => {
    dispatch(startSend())
    socket.emit('SEND_MESSAGE', msg)
    dispatch(sended())
    dispatch(finishSend())
  }
}

export function auth(username, color) {
  return dispatch => {
    dispatch(startSend())
    const settings = {username, color}

    axios.post('/create-user', settings)
      .then(res => {
        if (res.status === 200) {
          dispatch(setUserSettings(settings))
          socket.disconnect(true)
          socket.connect()
          dispatch(sended())
          dispatch(finishSend())
        }
      })
  }
}

export function socketConnect() {
  return dispatch => {
    socket = io()
  }
}

function getAuthData() {
  return dispatch => {
    axios
      .get('/login')
      .then(res => {
        if (res.data.isAuthed) dispatch(setUserSettings(res.data.payload))
      })
  }
}

function onlineCounterHandler() {
  return dispatch => {
    socket.on('UPDATE_ONLINE_COUNTER', val => {
      dispatch(updateChatOnlineCounter(val))
    })
  }
}

function getAllMessages() {
  return dispatch => {
    axios
      .get('/messages')
      .then(res => {
        dispatch(setMsgs(res.data))
      })
  }
}

function messagesHandler() {
  return dispatch => {
    socket.on('NEW_MESSAGE', i => {
      dispatch(addMsg(i.id, i.from, i.msg))
    })
  }
}

export function initialization() {
  return dispatch => {
    try {
      dispatch(getAuthData())
      dispatch(socketConnect())
      dispatch(onlineCounterHandler())
      dispatch(getAllMessages())
      dispatch(messagesHandler())
    } catch (e) {
      console.log('пойманная ошибка:', e)
      return false
    }
  }
}