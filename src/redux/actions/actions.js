import {
  ADD_MSG,
  FINISH_SENDING, HIDE_ALERT,
  SENDED, SERVER_CONNECTING, SERVER_OK, SERVER_UNAVAILABLE,
  SET_MSGS, SET_SERVER_STATUS,
  SET_USER_SETTINGS, SHOW_ALERT,
  START_SENDING,
  UPDATE_ONLINE_COUNTER
} from "./actionTypes";
import io from 'socket.io-client'
import axios from 'axios'
import axiosRetry from 'axios-retry'
axiosRetry(axios, { retries: 3, retryDelay: () => (1000) });

let socket
//todo проверить все экспортируемые функции на зависимость и перестать экспортировать независимые
const startSend = () => ({type: START_SENDING})
const sended = () => ({type: SENDED})
const finishSend = () => ({type: FINISH_SENDING})
const setUserSettings = settings => ({type: SET_USER_SETTINGS, payload: settings})
const clearUserSettings = () => ({type: SET_USER_SETTINGS, payload: {username: null, color: null}})
const updateChatOnlineCounter = val => ({type: UPDATE_ONLINE_COUNTER, payload: val})
//todo разобраться с сервер статусами
const setServerStatus = payload => ({type: SET_SERVER_STATUS, payload: payload})
const showAlert = payload => ({type: SHOW_ALERT, payload: payload})
export const hideAlert = () => ({type: HIDE_ALERT})

function alert(info) {
  return dispatch => {
    dispatch(showAlert(info))
    setTimeout(() => {
      dispatch(hideAlert())
    }, 10000)
  }
}

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
    axios
      .post('/create-user', settings)
      .then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            dispatch(alert(res.data.text))
            console.error('ошибка. неверное имя пользователя')
          } else {
            dispatch(setUserSettings(settings))
            socket.disconnect(true)
            socket.connect()
          }
        }
        dispatch(sended())
        dispatch(finishSend())
      })
      .catch(e => {
        console.error('ошибка при создании пользователя', e)
      })
  }
}

function socketConnect() {
  return dispatch => {
    socket = io()
    socket.on('disconnect', reason => {
      if (reason === 'transport error') {
        dispatch(initialization())
      }
    })
  }
}

function getAuthData() {
  return dispatch => {
    axios
      .get('/login')
      .then(res => {
        dispatch(setServerStatus(SERVER_OK))
        if (res.data.isAuthed) {
          dispatch(setUserSettings(res.data.payload))
        } else {
          dispatch(clearUserSettings())
        }
      })
      .catch(e => {
        socket.disconnect()
        dispatch(setServerStatus(SERVER_UNAVAILABLE))
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
      .catch(e => {
        console.error('не удалось получить список сообщений', e)
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

function onlineCounterHandler() {
  return dispatch => {
    socket.on('UPDATE_ONLINE_COUNTER', val => {
      dispatch(updateChatOnlineCounter(val))
    })
  }
}

export function initialization() {
  return dispatch => {
    dispatch(setServerStatus(SERVER_CONNECTING))
    dispatch(socketConnect())
    dispatch(getAuthData())
    dispatch(getAllMessages())
    dispatch(messagesHandler())
    dispatch(onlineCounterHandler())
  }
}