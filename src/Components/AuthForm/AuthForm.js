import React, {useEffect, useState} from 'react'
import styles from './AuthForm.module.css'
import {alert, auth} from "../../redux/actions/actions";
import {connect} from "react-redux";
import {REQUEST_ERROR, REQUEST_START, REQUEST_SUCCESS} from "../../redux/actions/actionTypes";
import ColorPicker from "../ColorPicker/ColorPicker";

function AuthForm({reqStatus, onAuth, onError}) {

  const [name, setName] = useState('')
  const [color, setColor] = useState(1)
  const [isNameError, setIsNameError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (reqStatus === REQUEST_START) {
      setIsLoading(true)
    } else if (reqStatus === REQUEST_SUCCESS || reqStatus === REQUEST_ERROR) {
      setIsLoading(false)
    }
  }, [reqStatus])

  function formValidation(username) {
    if (username.length < 4) {
      return 'Имя пользователя не может быть короче 4 символов'
    } else if (username.length > 10) {
      return 'Имя пользователя не может быть длиннее 10 символов'
    }
    return false
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const username = name.trim()
    const validationError = formValidation(username)
    if (!validationError) {
      setIsNameError(false)
      onAuth(username, color)
    } else {
      setIsNameError(true)
      onError(validationError)
    }
  }

  const errorStyle = {'border': '1px solid #DC143C'}

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
    >
      <div
        className={styles.inputsBox}

      >
        <input
          className={styles.input}
          value={name}
          style={isNameError ? errorStyle : null}
          onChange={event => setName(event.target.value)}
          disabled={isLoading}
          type="text"
          placeholder='nickname'
        />

        <span className={styles.CPLabel}>nickname color</span>
        <ColorPicker
          pickColor={setColor}
        />
      </div>
      <button
        className={`btn ${styles.btn}`}
        disabled={isLoading}
      >Войти
      </button>
    </form>
  )
}

const mapStateToProps = state => ({
  reqStatus: state.requestStatus
})

const mapDispatchToProps = dispatch => ({
  onAuth: (name, color) => dispatch(auth(name, color)),
  onError: (info) => dispatch(alert(info))
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm)