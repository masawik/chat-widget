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

const listeners = new Map()
const users = new Map()
const messages = [{
  id: 'test',
  from: 'username',
  color: '#fff',
  msg: 'test'
}]

app.post('/create-user', (req, res) => {
  const id = utils.idGenerator('user-')
  users.set(id, req.body)
  res.cookie('userid', id, {maxAge: 1000 * 60 * 60 * 24 * 365 * 20})
  res.send(req.body)
})

app.get('/login', (req, res) => {
  const cookiesUserId = req.cookies.userid
  let responseBody = {isAuthed: false}

  if (cookiesUserId && users.has(cookiesUserId)) {
    responseBody = {
      isAuthed: true,
      payload: {...users.get(cookiesUserId)}
    }
  }

  res.json(responseBody)
})

app.get('/messages', (req, res) => {
  res.json(messages)
})

io.on('connection', socket => {
  const cookies = cookie.parse(socket.request.headers.cookie)
  if (cookies.userid && users.has(cookies.userid)) {
    listeners.set(socket.id, cookies.userid)

    socket.on('SEND_MESSAGE', (msg) => {
      const userId = listeners.get(socket.id)
      const {username, color} = users.get(userId)

      const message = {
        id: utils.idGenerator('msg-', 4),
        from: username,
        color: color,
        msg
      }

      if(messages.length >= 100) {
        messages.shift()
      }

      messages.push(message)
      io.emit('NEW_MESSAGE', message)
    })

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