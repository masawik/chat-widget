import React, {Fragment} from 'react'
import './App.global.css'
import styles from './App.module.css'
import Chat from "../Components/Chat/Chat"

export default function App() {
  return (
    <Fragment>
      <div className={styles.container}>
        <Chat />
      </div>
    </Fragment>
  );
}