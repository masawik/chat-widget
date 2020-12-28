import React from 'react'
import styles from './Alerts.module.css'
import {hideAlert} from "../../redux/actions/actions";
import {connect} from "react-redux";
import {Transition} from "react-transition-group";

function Alerts({alert, onClose}) {
  function close() {
    onClose()
  }

  const transitionStyles = {
    entering: {transform: 'translateY(-100%)'},
    entered: {transform: 'translateY(0)'},
    exiting: {transform: 'translateY(-100%)'},
  };

  return (
    <Transition
      in={alert.visible}
      timeout={300}
      mountOnEnter
      unmountOnExit
    >
      {state => (
        <div
          className={styles.container}
          style={transitionStyles[state]}
          onClick={close}
        >
          <div className={styles.staticFiller}/>
          <div className={styles.filler}/>
          <div className={styles.text}>{alert.message}</div>
        </div>
      )}
    </Transition>
  )
}

const mapStateToProps = state => ({
  alert: state.alert
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(hideAlert())
})

export default connect(mapStateToProps, mapDispatchToProps)(Alerts)