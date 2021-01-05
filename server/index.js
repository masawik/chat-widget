const path = require('path')
const utils = require('./utils')
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const cookie = require('cookie')
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
const server = require('http').Server(app)

const io = require('socket.io')(server, {
  pingInterval: 10000,
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
})

const FLOOD_CONTROL_INTERVAL = 20000
const MAX_MSGS_COUNT_PER_FLOOD_INTERVAL = 10

const listeners = new Map()
const users = new Map()
let messages = []

setInterval(() => {
  users.forEach(user => {
    user.msgsCount = 0
  })
}, FLOOD_CONTROL_INTERVAL)

function isUsernameInvalid (newUser, existUserId = null) {
  if (newUser.username.length < 4) {
    return 'Имя пользователя не может быть короче 4 символов'
  } else if (newUser.username.length > 10) {
    return 'Имя пользователя не может быть длиннее 10 символов'
  }

  for (let [id, user] of users) {
     if (user.username.toLowerCase() === newUser.username.toLowerCase() && id !== existUserId) {
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
  if (msg.length < 3) {
    return 'сообщение не может быть короче 3 символов'
  } else if ( msg.length > 200) {
    return 'сообщение не может быть длиннее 200 символов'
  }
  return false
}

function getUserId (req) {
  const rawCookies = req.headers.cookie
  if (!rawCookies) return false

  const {userid} = cookie.parse(rawCookies)
  if (!users.has(userid)) return false
  return userid
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/dm', (req, res) => {
  messages = []
  res.send('messages deleted')
})

app.get('/du', (req, res) => {
  users.clear()
  listeners.clear()
  res.send('users deleted')
})

app.post('/create-user', (req, res) => {
  const invalidError = isUsernameInvalid(req.body)
  if (!invalidError) {
    const userId = utils.idGenerator('user-')
    res.cookie('userid', userId, {maxAge: 1000 * 60 * 60 * 24 * 365 * 20})
    users.set(userId, {...req.body, msgsCount: 0})
    res.send({error: false})
  } else {
    res.send({error: true, info: invalidError})
  }
})

app.post('/edit-user', (req, res) => {
  const userId = getUserId(req)
  if (!userId) return res.send(createError(1, 'unauthorized'))
  const invalidError = isUsernameInvalid(req.body, userId)
  if (!invalidError) {
    users.set(userId, {...req.body, msgsCount: 0})
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
  const userId = getUserId(req)
  if (!userId) return res.send(createError(1, 'unauthorized'))
  const user = users.get(userId)
  const {username, color, msgsCount} = user

  if (msgsCount > MAX_MSGS_COUNT_PER_FLOOD_INTERVAL) return res.send(createError(3, 'stop flood! mute 20sec'))

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

  users.set(userId, {...user, msgsCount: msgsCount + 1})
  messages.push(message)
  io.emit('NEW_MESSAGE', message)
  res.send({error: false})
})

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

const port = process.env.PORT || 5000
server.listen(port, err => {
  if (err) throw Error(err)
  console.log("Listening on " + port)
})