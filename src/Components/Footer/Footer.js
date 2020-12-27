import React, {useEffect, useState} from 'react'
import styles from './Footer.module.css'
import MessageForm from "../MessageForm/MessageForm";
import AuthForm from "../AuthForm/AuthForm";
import {Transition} from "react-transition-group";
import {connect} from "react-redux";
import {SENDED, START_SENDING} from "../../redux/actions/actionTypes";


function Footer({status, userName}) {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === START_SENDING) {
      setIsLoading(true)
    } else if (status === SENDED) {
      setIsLoading(false)
    }
  }, [status])

  useEffect(() => {
    setIsAuthed(Boolean(userName))
  }, [userName])

  // стили todo исправить появление формы авторизации при перезагрузке будучи авторизированным
  const transitionStyles = {
    entering: {opacity: 0, position: "absolute"},
    entered: {opacity: 1},
    exiting: {opacity: 0},
    exited: {opacity: 0},
  };

  return (
    <div className={styles.container}>
      <Transition
        in={isAuthed}
        timeout={{enter: 300}}
        mountOnEnter
        unmountOnExit
      >
        {state => (
          <MessageForm
            style={transitionStyles[state]}
            isLoading={isLoading}
          />
        )}
      </Transition>

      <Transition
        in={!isAuthed}
        timeout={{exit: 300}}
        mountOnEnter
        unmountOnExit
      >
        {state => (
          <AuthForm
            style={transitionStyles[state]}
            isLoading={isLoading}
          />
        )}
      </Transition>
    </div>
  )
}

const mapStateToProps = state => ({
  status: state.requestStatus,
  userName: state.user.username
})

export default connect(mapStateToProps)(Footer)