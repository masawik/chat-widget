import React from 'react'
import styles from './ChatMessages.module.css'
import './messagesAnimation.css'
import MessageItem from "../MessageItem/MessageItem";
import {connect} from "react-redux";
import {CSSTransition, TransitionGroup} from "react-transition-group";

function ChatMessages({messages}) {


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

  return (
    <TransitionGroup className={styles.container}>
        {$messages}
    </TransitionGroup>
  )
}

const mapStateToProps = state => ({
  messages: state.messages,
  user: state.user
})

export default connect(mapStateToProps, null)(ChatMessages)