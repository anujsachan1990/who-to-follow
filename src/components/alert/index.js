import React from "react"
import css from "./index.module.css"
export default function Alert({ msg, type }) {
  return (
    <div className={`${css.alert} ${css[type]}`}>
      <p>{msg}</p>
    </div>
  )
}
