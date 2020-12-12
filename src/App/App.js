import React, {Fragment, useEffect} from 'react'
import './App.global.css'
import styles from './App.module.css'
import Chat from "../Components/Chat/Chat"
import {connect} from "react-redux";
import {socketConnect} from "../redux/actions/actions";

function App({wsConnect}) {

  // useEffect(() => {
  //   wsConnect()
  // }, [])

  return (
    <Fragment>
      <div className={styles.container}>
        <Chat/>
      </div>
      <span>другой контент страницы</span>
    </Fragment>
  );
}

const mapDispatchToProps = dispatch => ({
  wsConnect: () => dispatch(socketConnect())
})

export default connect(null, mapDispatchToProps)(App)
