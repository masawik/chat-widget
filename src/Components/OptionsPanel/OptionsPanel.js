import React from 'react'
import styles from './OptionsPanel.module.css'
import AuthForm from "../AuthForm/AuthForm";
import {Transition} from "react-transition-group";

export default function OptionsPanel({open}) {
  const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
    exiting:  { opacity: 0, transform: 'scale(0.5)' },
    exited:  { opacity: 0 },
  };
  return (
    <Transition
      in={open}
      timeout={300}
      mountOnEnter
      unmountOnExit
    >
      {state => (
        <div
          className={styles.container}
          style={transitionStyles[state]}
        >
          <AuthForm
            edit={true}
          />
        </div>
      )}
    </Transition>
  )
}