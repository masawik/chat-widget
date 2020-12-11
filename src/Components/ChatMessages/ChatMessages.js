import React from 'react'
import styles from './ChatMessages.module.css'
import MessageItem from "../MessageItem/MessageItem";
import {connect} from "react-redux";

  function ChatMessages({messages}) {


  const $messages = messages.map(item => (
    <MessageItem
      key={item.id}
      name={item.from}
      text={item.msg}
    />
  ))

  return (
    <div className={styles.container}>
      {$messages}
    </div>
  )
}

const mapStateToProps = state => ({
  messages: state.messages,
  user: state.user
})

export default connect(mapStateToProps, null)(ChatMessages)