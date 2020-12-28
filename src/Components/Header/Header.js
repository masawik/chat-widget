import React, {Fragment} from 'react'
import styles from './Header.module.css'
import {connect} from "react-redux";
import Loader from "../Loader/Loader";

function Header({isCollapsed, toggleChat, online, isConnecting, isError, reconnect}) {

  let collapseBtnIconStyles = [styles.collapseBtnIcon]
  if (isCollapsed) collapseBtnIconStyles.push(styles.collapsed)
  collapseBtnIconStyles = collapseBtnIconStyles.join(' ')

  const $title = (
    <div className={styles.titleBox}>
      <span className={styles.title}>Chat</span>
      <span className={styles.online}>{online} online</span>
    </div>
  )

  const $connecting = (
    <Fragment>
      <Loader/> connecting...
    </Fragment>
  )

  const $reconnectBtn = (
    <button
      className={`btn ${styles.reloadBtn}`}
      onClick={reconnect}
    >
      <svg className={styles.reloadBtnIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><g><path d="M463.702,162.655L442.491,14.164c-1.744-12.174-16.707-17.233-25.459-8.481l-30.894,30.894C346.411,12.612,301.309,0,254.932,0C115.464,0,3.491,109.16,0.005,248.511c-0.19,7.617,5.347,14.15,12.876,15.234l59.941,8.569c8.936,1.304,17.249-5.712,17.125-15.058C88.704,165.286,162.986,90,254.932,90c22.265,0,44.267,4.526,64.6,13.183l-29.78,29.78c-8.697,8.697-3.761,23.706,8.481,25.459l148.491,21.211C456.508,181.108,465.105,172.599,463.702,162.655z"/></g></g><g><g><path d="M499.117,249.412l-59.897-8.555c-7.738-0.98-17.124,5.651-17.124,16.143c0,90.981-74.019,165-165,165c-22.148,0-44.048-4.482-64.306-13.052l28.828-28.828c8.697-8.697,3.761-23.706-8.481-25.459L64.646,333.435c-9.753-1.393-18.39,6.971-16.978,16.978l21.21,148.492c1.746,12.187,16.696,17.212,25.459,8.481l31.641-31.626C165.514,499.505,210.587,512,257.096,512c138.794,0,250.752-108.618,254.897-247.28C512.213,257.088,506.676,250.496,499.117,249.412z"/></g></g></svg>
    </button>
  )

  const $error = (
    <Fragment>
      {$reconnectBtn} connection error :(
    </Fragment>
  )

  const $content = isConnecting ? $connecting : isError ? $error : $title

  return (
    <div className={styles.container}>
      {$content}
      <div className={styles.buttonsBox}>
        <button className={`btn ${styles.pinBtn}`}>
          <svg className={styles.pinBtnIcon} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <g>
              <path
                d="m188.852 183.848c-35.147-35.147-92.132-35.147-127.279 0l266.579 266.579c35.147-35.147 35.147-92.132 0-127.279 0 0-139.3-139.3-139.3-139.3z"/>
              <path d="m319.667 95.46-105.496 71.28 131.088 131.089 71.281-105.496z"/>
              <path
                d="m351.487 0c-23.431 23.431-23.431 61.421 0 84.853l75.66 75.66c23.431 23.431 61.421 23.431 84.853 0z"/>
              <path d="m-23.161 404.872h230.578v30h-230.578z"
                    transform="matrix(.707 -.707 .707 .707 -269.911 188.122)"/>
            </g>
          </svg>
        </button>

        <button
          onClick={toggleChat}
          className={`btn ${styles.collapseBtn}`}
        >
          <svg className={collapseBtnIconStyles} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492.004 492.004">
            <path
              d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  online: state.chatUsersCounter
})

export default connect(mapStateToProps)(Header)