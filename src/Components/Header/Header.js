import React from 'react'
import styles from './Header.module.css'

export default function () {

  const online = 123

  return (
    <div className={styles.container}>
      <div className={styles.titleBox}>
        <span className={styles.title}>Chat</span>
        <span className={styles.online}>{online} online</span>
      </div>

      <div className={styles.buttonsBox}>
        <button className={`btn ${styles.pinBtn}`}>
          <svg className={styles.pinBtnIcon} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><g><path d="m188.852 183.848c-35.147-35.147-92.132-35.147-127.279 0l266.579 266.579c35.147-35.147 35.147-92.132 0-127.279 0 0-139.3-139.3-139.3-139.3z"/><path d="m319.667 95.46-105.496 71.28 131.088 131.089 71.281-105.496z"/><path d="m351.487 0c-23.431 23.431-23.431 61.421 0 84.853l75.66 75.66c23.431 23.431 61.421 23.431 84.853 0z"/><path d="m-23.161 404.872h230.578v30h-230.578z" transform="matrix(.707 -.707 .707 .707 -269.911 188.122)"/></g></svg>
        </button>

        <button
          className={`btn ${styles.collapseBtn}`}
        >
          <svg className={styles.collapseBtnIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492.004 492.004"><path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"/></svg>
        </button>
      </div>
    </div>
  )
}