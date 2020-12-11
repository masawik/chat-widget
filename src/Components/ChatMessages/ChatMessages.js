import React from 'react'
import styles from './ChatMessages.module.css'
import MessageItem from "../MessageItem/MessageItem";

export default function ChatMessages() {
  const messages = [
    {
      id: 'firstMessage',
      name: 'я сам',
      text: 'привет это же я сам ты чего, не узнал?'
    },
    {
      id: 'wvergMessage',
      name: 'Второй я',
      text: 'как у тебя дела?'
    },
    {
      id: 'fiervgvssage',
      name: 'third_IM',
      text: 'пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук пук'
    },
  ]

  const $messages = messages.map(item => (
    <MessageItem
      key={item.id}
      name={item.name}
      text={item.text}
    />
  ))

  return (
    <div className={styles.container}>
      {$messages}
    </div>
  )
}