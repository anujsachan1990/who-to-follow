import React from "react"
import css from "./index.module.css"
export default function Alert({ msg }) {
  return (
    <div className={`${css.alert} ${css.success}`}>
      <p>{msg}</p>
    </div>
  )
}
