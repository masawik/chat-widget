import React, {Fragment, useState} from 'react'
import styles from './Chat.module.css'
import Header from "../Header/Header";
import ChatMessages from "../ChatMessages/ChatMessages";
import Footer from "../Footer/Footer";

export default function Chat() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  function toggleChat() {
    setIsCollapsed(prevState => !prevState)
  }

  let chatBodyStyles = [styles.body]
  if (isCollapsed) chatBodyStyles.push(styles.collapsed)
  chatBodyStyles = chatBodyStyles.join(' ')

  return (
    <Fragment>
      <Header
        isCollapsed={isCollapsed}
        toggleChat={toggleChat}
      />
      <div className={chatBodyStyles}>
        <ChatMessages/>
        <Footer/>
      </div>
    </Fragment>
  )
}