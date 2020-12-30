import React, {useEffect, useRef, useState} from 'react'
import styles from './ChatMessages.module.css'
import './messagesAnimation.css'
import MessageItem from "../MessageItem/MessageItem";
import {connect} from "react-redux";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import SystemMessage from "./SystemMessage/SystemMessage";
import {setReplyPurpose} from "../../redux/actions/actions";
import {colorsHexId} from "../colors";


function ChatMessages({messages, myUserName, onSetPurpose}) {
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

  function setPurpose(username) {
    onSetPurpose(username)
  }

  const $messages = messages.map(item => {
    const msg = item.msg
    const name = item.from
    const regExp = new RegExp('(^|@)' + myUserName + ',?')
    return (
      <CSSTransition
        timeout={200}
        key={item.id}
        classNames={"message"}
      >
        <MessageItem
          name={name}
          text={msg}
          onSetPurpose={myUserName ===  name ? null : () => setPurpose(name)}
          highlighted={regExp.test(msg)}
          nickNameColor={colorsHexId[item.color] || '#000'}
        />
      </CSSTransition>
    )
  })

  return (
    <div
      ref={messageRef}
      className={styles.container}
      onScroll={isMessagesTouched ? null : touchMessages}
    >
      {
        messages.length
          ? <TransitionGroup>{$messages}</TransitionGroup>
          : <SystemMessage message='сообщений пока нет :('/>
      }
    </div>
  )
}

const mapStateToProps = state => ({
  messages: state.messages,
  myUserName: state.user.username
})

const mapDispatchToProps = dispatch => ({
  onSetPurpose: username => dispatch(setReplyPurpose(username))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatMessages)