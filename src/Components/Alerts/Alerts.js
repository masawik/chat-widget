import React from 'react'
import styles from './Alerts.module.css'
import './Alerts.css'
import {hideAlert} from "../../redux/actions/actions";
import {connect} from "react-redux";
import {CSSTransition, TransitionGroup} from "react-transition-group";

function Alerts({alerts, onClose}) {
  function close(id) {
    onClose(id)
  }

  const $alerts = Object.entries(alerts).reverse().map(([id, message]) => {
    return (
      <CSSTransition
        key={id}
        timeout={300}
        classNames='alert-transition'
      >
        <div
          className={styles.alertItem}
          onClick={() => close(id)}
        >
          <div className={styles.staticFiller}/>
          <div className={styles.filler}/>
          <div className={styles.text}>{message}</div>
        </div>
      </CSSTransition>
    )
  });

  return (
    <TransitionGroup className={styles.container}>
      {$alerts}
    </TransitionGroup>
  )
}

const mapStateToProps = state => ({
  alerts: state.alert
})

const mapDispatchToProps = dispatch => ({
  onClose: id => dispatch(hideAlert(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(Alerts)