import React from 'react'
import styles from './MessageItem.module.css'

export default function MessageItem({name, text, highlighted, onSetPurpose, nickNameColor}) {
  const extraStyles = highlighted ? styles.highlighted : null
  return (
      <div
        className={`${styles.messageItem} ${extraStyles}`}
      >
        <span
          onClick={onSetPurpose}
          className={styles.name}
          style={{'color':nickNameColor}}
        >{name}</span>
        <span
          className={styles.text}
        >{text}</span>
      </div>
  )
}