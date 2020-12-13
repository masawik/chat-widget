import React, {Fragment, useEffect, useState} from 'react'
import './App.global.css'
import styles from './App.module.css'
import Chat from "../Components/Chat/Chat"
import {connect} from "react-redux";
import {initialization} from "../redux/actions/actions";

function App({init}) {
  const [isInitialized, setIsInitialized] = useState(false)
  //TODO убирать чат из дом дерева если не удалось подключиться много раз. выводить заглушку
  useEffect(() => {
    init()
    // убрать timeout
    setTimeout(() => {setIsInitialized(true)}, 300)
  }, [])

  return (
    <Fragment>
      <div className={styles.container}>
        <Chat
          isInitialized={isInitialized}
        />
      </div>
      <span>другой контент страницы</span>
    </Fragment>
  );
}

const mapDispatchToProps = dispatch => ({
  init: () => dispatch(initialization())
})

export default connect(null, mapDispatchToProps)(App)
