import React, {useEffect, useState} from 'react'
import styles from './Footer.module.css'
import MessageForm from "../MessageForm/MessageForm";
import AuthForm from "../AuthForm/AuthForm";
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

  const $messageForm = (<MessageForm isLoading={isLoading} />)
  const $authForm = (<AuthForm isLoading={isLoading} />)

  return (
    <div className={styles.container}>
      {isAuthed ? $messageForm : $authForm}
    </div>
  )
}

const mapStateToProps = state => ({
  status: state.requestStatus,
  userName: state.user.username
})

export default connect(mapStateToProps)(Footer)