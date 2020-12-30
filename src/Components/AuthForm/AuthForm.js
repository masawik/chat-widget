import React, {useEffect, useState} from 'react'
import styles from './AuthForm.module.css'
import {alert, auth, edit} from "../../redux/actions/actions";
import {connect} from "react-redux";
import {REQUEST_ERROR, REQUEST_START, REQUEST_SUCCESS} from "../../redux/actions/actionTypes";
import {CirclePicker} from "react-color";
import {colors, colorsHexId} from "../colors";

function AuthForm({reqStatus, onAuth, onEdit, onError, user, edit}) {
  const [name, setName] = useState(user.username || '')
  const [color, setColor] = useState(user.color || 1)
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
      if (edit) {
        onEdit(username, color)
      } else {
        onAuth(username, color)
      }
    } else {
      setIsNameError(true)
      onError(validationError)
    }
  }

  const errorStyle = {'border': '1px solid #DC143C'}
  const arrColors = Array.from(colors.keys())
  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
    >
      <div>
        <input
          className={styles.input}
          value={name}
          style={isNameError ? errorStyle : null}
          onChange={event => setName(event.target.value)}
          disabled={isLoading}
          type="text"
          placeholder='Ник'
        />
        <button
          className={`btn ${styles.btn}`}
          disabled={isLoading}
        >ok
        </button>
      </div>

      <span className={styles.CPLabel}>Цвет ника</span>
      <CirclePicker
        colors={arrColors}
        circleSize={18}
        circleSpacing={5}
        color={colorsHexId[color]}
        onChangeComplete={color => setColor(colors.get(color.hex))}
      />
    </form>
  )
}

const mapStateToProps = state => ({
  reqStatus: state.requestStatus,
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  onAuth: (name, color) => dispatch(auth(name, color)),
  onEdit: (name, color) => dispatch(edit(name, color)),
  onError: (info) => dispatch(alert(info)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm)