import React, {useState} from 'react'
import styles from './AuthForm.module.css'
import {alert, auth} from "../../redux/actions/actions";
import {connect} from "react-redux";

function AuthForm({isLoading, onAuth, onError}) {

  const [name, setName] = useState('')
  const [color, setColor] = useState('#76a306')
  const [isNameError, setIsNameError] = useState(false)

  function formValidation() {
    if (name.length < 4) {
      return 'Имя пользователя не может быть короче 4 символов'
    } else if (name.length > 10) {
      return 'Имя пользователя не может быть длиннее 10 символов'
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const validationError = formValidation()
    if (!validationError) {
      setIsNameError(false)
      onAuth(name, color)
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
          placeholder='username'
          value={name}
          style={isNameError ? errorStyle : null}
          onChange={event => setName(event.target.value)}
          disabled={isLoading}
          type="text"
        />

        <input
          className={styles.input}
          placeholder='color'
          value={color}
          onChange={event => setColor(event.target.value)}
          disabled={isLoading}
          type="text"
        />
      </div>
      <button
        className={`btn ${styles.btn}`}
        disabled={isLoading}
      >Войти</button>
    </form>
  )
}

const mapDispatchToProps = dispatch => ({
  onAuth: (name, color) => dispatch(auth(name, color)),
  onError: (info) => dispatch(alert(info))
})

export default connect(null, mapDispatchToProps)(AuthForm)