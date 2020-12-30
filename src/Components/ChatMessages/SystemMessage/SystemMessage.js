import React from 'react'
import styles from './SystemMessage.module.css'

export default function SystemMessage({message}) {
  return (<div className={styles.message}>{message}</div>)
}