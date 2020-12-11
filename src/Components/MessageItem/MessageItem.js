import React from 'react'
import styles from './MessageItem.module.css'

export default function MessageItem({name, text}) {
  return (
    <div className={styles.messageItem}>
      <span className={styles.name}>{name}</span>
      <span className={styles.text}>{text}</span>
    </div>
  )
}