import React, {useEffect, useState} from 'react'
import './Chat.css'
import styles from './Chat.module.css'
import Header from "../Header/Header";
import ChatMessages from "../ChatMessages/ChatMessages";
import Footer from "../Footer/Footer";
import {initialization} from "../../redux/actions/actions";
import {connect} from "react-redux";
import {SERVER_CONNECTING, SERVER_OK, SERVER_UNAVAILABLE} from "../../redux/actions/actionTypes";
import {CSSTransition} from "react-transition-group";
import Alerts from "../Alerts/Alerts";
import Draggable from 'react-draggable';


function Chat({init, serverStatus}) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isPinned, setIsPinned] = useState(true)
  const [chatPos, setChatPos] = useState({x: 0, y: 0})
  const [lastChatPos, setLastChatPos] = useState(null)

  useEffect(() => {
    const lastPos = window.localStorage.getItem('lastChatPosition')
    if (lastPos) setLastChatPos(JSON.parse(lastPos))
    init()
  }, [init])

  useEffect(() => {
    if (serverStatus === SERVER_OK) {
      setIsCollapsed(false)
    } else if (serverStatus === SERVER_CONNECTING) {
      setIsCollapsed(true)
    }
  }, [serverStatus])

  function manualInit() {
    init()
  }

  function toggleChat() {
    if (serverStatus === SERVER_OK) setIsCollapsed(prevState => !prevState)
  }

  function togglePin() {
    if (isPinned) {
      setIsPinned(false)
      setChatPos(lastChatPos || {x: 0, y: 0})
    } else {
      setIsPinned(true)
      setChatPos({x: 0, y: 0})
    }
  }

  function onDragStop(event, dragEvent) {
    const maxX = window.innerWidth - dragEvent.node.clientWidth
    const maxY = window.innerHeight - dragEvent.node.clientHeight

    const X = maxX > dragEvent.x
      ? dragEvent.x > -10 ? dragEvent.x : -10
      : maxX
    const Y = maxY > dragEvent.y
      ? dragEvent.y > -20 ? dragEvent.y : -20
      : maxY

    const newPos = {x: X, y: Y}

    window.localStorage.setItem('lastChatPosition', JSON.stringify(newPos))
    setLastChatPos(newPos)
    setChatPos(newPos)
  }

  const unpinnedChatStyles = {
    'position': 'fixed',
    'width': '400px',
    'top' : 10,
    'left' : 10
  }
  const unpinnedChatBodyStyles = {'boxShadow': '0 10px 20px -5px rgba(0, 0, 0, 0.2)'}
  const dragHandleTarget = "chat-header"
  return (
    <Draggable
      disabled={isPinned}
      handle={'.' + dragHandleTarget}
      position={chatPos}
      onStop={onDragStop}
    >
      <div
        className={styles.container}
        style={isPinned ? null : unpinnedChatStyles}
      >
        <Header
          draggable={dragHandleTarget}
          isCollapsed={isCollapsed}
          togglePin={togglePin}
          isPinned={isPinned}
          isConnecting={serverStatus === SERVER_CONNECTING}
          isError={serverStatus === SERVER_UNAVAILABLE}
          reconnect={manualInit}
          toggleChat={toggleChat}
        />
        <CSSTransition
          in={isCollapsed}
          timeout={300}
          classNames='body-collapsing'
        >
          <div
            className='chat-body'
            style={isPinned ? null : unpinnedChatBodyStyles}
          >
            <Alerts/>
            <ChatMessages/>
            <Footer/>
          </div>
        </CSSTransition>
      </div>
    </Draggable>
  )
}

const mapStateToProps = state => ({
  serverStatus: state.serverStatus
})

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(initialization())
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)