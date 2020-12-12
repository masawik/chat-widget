import React, {useState} from 'react'
import styles from './Footer.module.css'
import MessageForm from "../MessageForm/MessageForm";
import AuthForm from "../AuthForm/AuthForm";
import {Transition} from "react-transition-group";


export default function Footer() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // стили
  const transitionStyles = {
    entering: {opacity: 0, position: "absolute"},
    entered: {opacity: 1},
    exiting: {opacity: 0},
    exited: {opacity: 0},
  };
  const timeout = {
    enter: 300,
    exit: 300,
  }

  return (
    <div className={styles.container}>
      <Transition
        in={!isAuthed}
        timeout={timeout}
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

      <Transition
        in={isAuthed}
        timeout={timeout}
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
    </div>
  )
}