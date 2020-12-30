import {
  ADD_MSG,
  HIDE_ALERT,
  REQUEST_SUCCESS, SERVER_CONNECTING, SERVER_OK, SERVER_UNAVAILABLE,
  SET_MSGS,
  SET_USER_SETTINGS, SHOW_ALERT,
  REQUEST_START,
  UPDATE_ONLINE_COUNTER, REQUEST_ERROR, SET_REPLY_PURPOSE, CLEAR_REPLY_PURPOSE
} from "./actionTypes";
import io from 'socket.io-client'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import {idGenerator} from "../../utils";

axiosRetry(axios, {retries: 3, retryDelay: () => (1000)});

let socket
const reqStart = () => ({type: REQUEST_START})
const reqSuccess = () => ({type: REQUEST_SUCCESS})
const reqError = () => ({type: REQUEST_ERROR})

const serverConnecting = () => ({type: SERVER_CONNECTING})
const serverOk = () => ({type: SERVER_OK})
const serverUnavailable = () => ({type: SERVER_UNAVAILABLE})

const setUserSettings = settings => ({type: SET_USER_SETTINGS, payload: settings})

export const setReplyPurpose = payload => ({type: SET_REPLY_PURPOSE, payload: payload})
export const clearReplyPurpose = payload => ({type: CLEAR_REPLY_PURPOSE})

const clearUserSettings = () => ({type: SET_USER_SETTINGS, payload: {username: null, color: null}})
const updateChatOnlineCounter = val => ({type: UPDATE_ONLINE_COUNTER, payload: val})
const showAlert = payload => ({type: SHOW_ALERT, payload: payload})
export const hideAlert = payload => ({type: HIDE_ALERT, payload: payload})

export function alert(info) {
  return dispatch => {
    const newAlertId = idGenerator('alert', 4)
    dispatch(showAlert({id: newAlertId, info: info}))
    setTimeout(() => {
      dispatch(hideAlert(newAlertId))
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

function setMsgs(msgs) {
  return {
    type: SET_MSGS,
    payload: msgs
  }
}

export function sendMsg(msg) {
  return dispatch => {
    dispatch(reqStart())
    axios
      .post('/send_msg', {msg})
      .then(res => {
        if (res.data.error) {
          const error = res.data
          dispatch(alert(error.info))

          if (error.code === 1) {
            dispatch(clearUserSettings())
            dispatch(reqError())
          }

          if (error.code === 3) {
            dispatch(reqStart())
            setTimeout(() => {
              dispatch(reqError())
            }, 20000)
          }

        } else {
          dispatch(reqSuccess())
        }
      })
      .catch(e => {
        console.error('ошибка при отправке сообщения', e)
        dispatch(reqError())
      })

  }
}

export function auth(username, color) {
  return dispatch => {
    dispatch(reqStart())
    const settings = {username, color}
    axios
      .post('/create-user', settings)
      .then(res => {
        if (res.data.error) {
          dispatch(alert(res.data.info))
          dispatch(reqError())
        } else {
          dispatch(setUserSettings(settings))
          socket.disconnect()
          socket.connect()
          dispatch(reqSuccess())
        }
      })
      .catch(e => {
        console.error('ошибка при создании пользователя', e)
        dispatch(reqError())
      })
  }
}

function socketConnect() {
  return dispatch => {
    socket = io()
  }
}

function socketBreakHandler() {
  return dispatch => {
    socket.on('connect', () => {
      dispatch(serverOk())
    })

    socket.on('disconnect', reason => {
      if (reason === 'forced close') {
        dispatch(reqStart())
        socket.on('connect', () => {
          dispatch(reqSuccess())
        })
      } else if (reason === 'transport error') {
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
        if (res.data.isAuthed) {
          dispatch(setUserSettings(res.data.payload))
        } else {
          dispatch(clearUserSettings())
        }
      })
      .catch(e => {
        socket.disconnect()
        dispatch(serverUnavailable())
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
    dispatch(serverConnecting())
    dispatch(socketConnect())
    dispatch(socketBreakHandler())
    dispatch(getAuthData())
    dispatch(getAllMessages())
    dispatch(messagesHandler())
    dispatch(onlineCounterHandler())
  }
}