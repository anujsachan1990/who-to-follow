import React from "react"
import css from "./index.module.css"

export const AlertTemplate = ({ style, options, message, close }) => (
  <div className={`${css.alert} ${css[options.type]}`}>
    {message}
    {/* <button onClick={close}>X</button> */}
  </div>
)
