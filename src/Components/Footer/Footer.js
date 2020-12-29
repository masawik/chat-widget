import React, {useEffect, useState} from 'react'
import styles from './Footer.module.css'
import MessageForm from "../MessageForm/MessageForm";
import AuthForm from "../AuthForm/AuthForm";
import {connect} from "react-redux";


function Footer({status, userName}) {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    setIsAuthed(Boolean(userName))
  }, [userName])

  const $messageForm = (<MessageForm />)
  const $authForm = (<AuthForm />)

  return (
    <div className={styles.container}>
      {isAuthed ? $messageForm : $authForm}
    </div>
  )
}

const mapStateToProps = state => ({
  userName: state.user.username
})

export default connect(mapStateToProps)(Footer)