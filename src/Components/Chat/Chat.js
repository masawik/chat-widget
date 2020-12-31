import React, {useEffect, useRef, useState} from 'react'
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
  const [containerStyles, setContainerStyles] = useState(null)
  const [chatPos, setChatPos] = useState({x: 0, y: 0})
  const chatContainer = useRef()

  useEffect(() => {
    init()
  }, [])

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
      const $chat = chatContainer.current
      const currentWidth = $chat.clientWidth < 400 ? $chat.clientWidth : 400

      setContainerStyles({
        'position': 'fixed',
        'width': currentWidth,
      })

      setIsPinned(false)
      setChatPos({x: 10, y: 10})
    } else {
      setContainerStyles(null)
      setIsPinned(true)
      setChatPos({x: 0, y: 0})
    }
  }

  function onDragStop(event, dragEvent) {
    setChatPos({x: dragEvent.x, y: dragEvent.y})
  }

  const dragHandle = "chat-header"
  return (
    <Draggable
      disabled={isPinned}
      handle={'.' + dragHandle}
      position={chatPos}
      onStop={onDragStop}
    >
      <div
        className={styles.container}
        style={{...containerStyles}}
        ref={chatContainer}
      >
        <Header
          draggable={dragHandle}
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
            style={isPinned ? null : {'boxShadow': '0 10px 20px -5px rgba(0, 0, 0, 0.2)'}}
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