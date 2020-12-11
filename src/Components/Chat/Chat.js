import React, {Fragment} from 'react'
import styles from './Chat.module.css'
import Header from "../Header/Header";
import ChatMessages from "../ChatMessages/ChatMessages";
import Footer from "../Footer/Footer";

export default function Chat() {
  const isCollapsed = false


  let chatBodyStyles = [styles.body]
  if (isCollapsed) chatBodyStyles.push(styles.collapsed)
  chatBodyStyles = chatBodyStyles.join(' ')
  return (
    <Fragment>
      <Header/>
      <div className={chatBodyStyles}>
        <ChatMessages/>
        <Footer/>
      </div>
    </Fragment>
  )
}