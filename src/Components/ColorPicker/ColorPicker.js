import styles from './ColorPicker.module.css'
import React, {useEffect, useState} from 'react'
import {CirclePicker} from "react-color";
import {colors} from "../colors";

export default function ColorPicker({pickColor}) {
  const [curColor, setCurColor] = useState('#000')
  const arrColors = Array.from(colors.keys())

  useEffect(() => {
    pickColor(colors.get(curColor) || 1)
  }, [curColor])

  return (
    <div className={styles.container}>
      <CirclePicker
        colors={arrColors}
        circleSize={18}
        circleSpacing={5}
        color={curColor}
        onChangeComplete={color => setCurColor(color.hex)}
      />
    </div>
  )
}