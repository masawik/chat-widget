import React, {Fragment, useEffect, useState} from 'react'
import styles from './Chat.module.css'
import Header from "../Header/Header";
import ChatMessages from "../ChatMessages/ChatMessages";
import Footer from "../Footer/Footer";
import {initialization} from "../../redux/actions/actions";
import {connect} from "react-redux";
import {SERVER_CONNECTING, SERVER_OK, SERVER_UNAVAILABLE} from "../../redux/actions/actionTypes";

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
    //TODO изменить анимацию разворачивания тела чата т.к. глючит на телефоне
    if (serverStatus === SERVER_OK) setIsCollapsed(prevState => !prevState)
  }

  let chatBodyStyles = [styles.body]
  if (isCollapsed) chatBodyStyles.push(styles.collapsed)
  chatBodyStyles = chatBodyStyles.join(' ')
  return (
    <Fragment>
      <Header
        isCollapsed={isCollapsed}
        isConnecting={serverStatus === SERVER_CONNECTING}
        isError={serverStatus === SERVER_UNAVAILABLE}
        reconnect={manualInit}
        toggleChat={toggleChat}
      />
      <div className={chatBodyStyles}>
        <ChatMessages/>
        <Footer/>
      </div>
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