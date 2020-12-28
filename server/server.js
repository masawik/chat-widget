const utils = require('./utils')
const express = require('express')
const cookieParser = require('cookie-parser')
const cookie = require('cookie')
const app = express()
app.use(express.json())
app.use(cookieParser())
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  pingInterval: 10000
})

const FLOOD_CONTROL_INTERVAL = 20000
const MAX_MSGS_COUNT_PER_FLOOD_INTERVAL = 10

const listeners = new Map()
const users = new Map()
const messages = []

setInterval(() => {
  users.forEach(user => {
    user.msgsCount = 0
  })
}, FLOOD_CONTROL_INTERVAL)

function isUsernameInvalid (newUser) {
  if (newUser.username.length < 4) {
    return 'Имя пользователя не может быть короче 4 символов'
  } else if (newUser.username.length > 10) {
    return 'Имя пользователя не может быть длиннее 10 символов'
  }

  for (let user of users.values()) {
     if (user.username === newUser.username) {
      return 'Пользователь с таким именем уже существует'
    }
  }
  return false
}

function createError(code, info) {
  return {
    error: true,
    code,
    info
  }
}

function isMessageInvalid (msg) {


  return false
}

app.post('/create-user', (req, res) => {
  const invalidError = isUsernameInvalid(req.body)
  if (!invalidError) {
    const id = utils.idGenerator('user-')
    users.set(id, {...req.body, msgsCount: 0})
    res.cookie('userid', id, {maxAge: 1000 * 60 * 60 * 24 * 365 * 20})
    res.send({error: false})
  } else {
    res.send({error: true, info: invalidError})
  }
})

app.get('/login', (req, res) => {
  const cookiesUserId = req.cookies.userid
  let responseBody = {isAuthed: false}

  if (cookiesUserId && users.has(cookiesUserId)) {
    const {username, color} = users.get(cookiesUserId)
    responseBody = {
      isAuthed: true,
      payload: {username, color}
    }
  }

  res.json(responseBody)
})

app.get('/messages', (req, res) => {
  res.json(messages)
})

app.post('/send_msg', (req, res) => {
  //todo не забыть обработать на клиенте. очишать авторизацию
  const rawCookies = req.headers.cookie
  if (!rawCookies) return res.send(createError(1, 'unauthorized'))

  const {userid} = cookie.parse(rawCookies)
  if (!users.has(userid)) return res.send(createError(1, 'unauthorized'))
  const user = users.get(userid)
  const {username, color, msgsCount} = user

  if (msgsCount > MAX_MSGS_COUNT_PER_FLOOD_INTERVAL) return res.send(createError(3, 'не флуди! мут на 20 секунд'))

  const msg = req.body.msg
  const msgError = isMessageInvalid(msg)
  if (msgError) return res.send(createError(2, msgError))

  const message = {
    id: utils.idGenerator('msg-', 4),
    from: username,
    color: color,
    msg
  }

  if(messages.length >= 100) {
    messages.shift()
  }

  users.set(userid, {...user, msgsCount: msgsCount + 1})
  messages.push(message)
  io.emit('NEW_MESSAGE', message)
  res.send('ok')
})

//todo убрать лишнее
io.on('connection', socket => {
  let cookies
  if (socket.request.headers.cookie) {
    cookies = cookie.parse(socket.request.headers.cookie)
  }
  if (cookies && cookies.userid && users.has(cookies.userid)) {
    listeners.set(socket.id, cookies.userid)

    socket.on('disconnect', () => {
      listeners.delete(socket.id)
      io.emit('UPDATE_ONLINE_COUNTER', listeners.size)
    });
  }
  io.emit('UPDATE_ONLINE_COUNTER', listeners.size)
})

server.listen(9999, err => {
  if (err) throw Error(err)
  console.log('server started')
})