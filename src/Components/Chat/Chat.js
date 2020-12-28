import React, {Fragment, useEffect, useState} from 'react'
import './Chat.css'
import Header from "../Header/Header";
import ChatMessages from "../ChatMessages/ChatMessages";
import Footer from "../Footer/Footer";
import {initialization} from "../../redux/actions/actions";
import {connect} from "react-redux";
import {SERVER_CONNECTING, SERVER_OK, SERVER_UNAVAILABLE} from "../../redux/actions/actionTypes";
import {CSSTransition} from "react-transition-group";
import Alerts from "../Alerts/Alerts";

function Chat({init, serverStatus}) {
  const [isCollapsed, setIsCollapsed] = useState(true)

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

  return (
    <Fragment>
      <Header
        isCollapsed={isCollapsed}
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
        <div className='chat-body'>
          <Alerts />
          <ChatMessages/>
          <Footer/>
        </div>
      </CSSTransition>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  serverStatus: state.serverStatus
})

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(initialization())
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat)