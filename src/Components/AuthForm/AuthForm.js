import React, {useState} from 'react'
import styles from './AuthForm.module.css'
import {auth} from "../../redux/actions/actions";
import {connect} from "react-redux";

function AuthForm({isLoading, onAuth}) {

  const [name, setName] = useState('')
  const [color, setColor] = useState('#76a306')

  const onSubmit = (e) => {
    e.preventDefault()
    onAuth(name, color)
  }

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
    >
      <div className={styles.inputsBox}>
        <input
          className={styles.input}
          placeholder='username'
          value={name}
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
  onAuth: (name, color) => dispatch(auth(name, color))
})

export default connect(null, mapDispatchToProps)(AuthForm)