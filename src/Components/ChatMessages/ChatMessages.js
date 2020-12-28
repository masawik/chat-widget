import React, {useEffect, useRef, useState} from 'react'
import styles from './ChatMessages.module.css'
import './messagesAnimation.css'
import MessageItem from "../MessageItem/MessageItem";
import {connect} from "react-redux";
import {CSSTransition, TransitionGroup} from "react-transition-group";

function ChatMessages({messages}) {
  const [isMessagesTouched, setIsMessagesTouched] = useState(false)
  const messageRef = useRef()

  useEffect(() => {
    const $el = messageRef.current
    const elScrollHeight = $el.scrollHeight

    if (!isMessagesTouched || $el.scrollTop + 100 >= (elScrollHeight - $el.clientHeight)) {
      $el.scroll(0, elScrollHeight)
    }
  }, [messages])

  function touchMessages() {
    setIsMessagesTouched(true)
  }

  const $messages = messages.map(item => (
    <CSSTransition
      timeout={200}
      key={item.id}
      classNames={"message"}
    >
      <MessageItem
        name={item.from}
        text={item.msg}
      />
    </CSSTransition>
  ))


  //TODO добавить "сообщений пока нет" если сообщений нет. выделять сообщение жирным, если оно адресовано мне
  return (
    <div
      ref={messageRef}
      className={styles.container}
      onScroll={isMessagesTouched ? null : touchMessages}
    >
      <TransitionGroup
      >
        {$messages}
      </TransitionGroup>
    </div>
  )
}

const mapStateToProps = state => ({
  messages: state.messages
})

export default connect(mapStateToProps)(ChatMessages)