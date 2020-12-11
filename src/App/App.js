import React, {Fragment} from 'react'
import './App.global.css'
import styles from './App.module.css'
import Chat from "../Components/Chat/Chat";

function App() {
  return (
    <Fragment>
      <div className={styles.container}>
        <Chat/>
      </div>
      <span>другой контент страницы</span>
    </Fragment>
  );
}

export default App;
