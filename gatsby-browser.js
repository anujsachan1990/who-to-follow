// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"

import "prismjs/themes/prism.css"

import React from "react"
import { Auth0Provider } from "./src/utils/auth"
import { transitions, positions, Provider as AlertProvider } from "react-alert"
import { AlertTemplate } from "./src/components/alert/index"
const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  )
}

const Auth0Domain = process.env.GATSBY_AUTH0_DOMAIN
const Auth0ClientID = process.env.GATSBY_AUTH0_CLIENT_ID
const Auth0Audience = process.env.GATSBY_AUTH0_AUDIENCE

const alertOptions = {
  // you can also just use 'bottom center'
  position: positions.TOP_LEFT,
  timeout: 3000,
  offset: "30px",
  // you can also just use 'scale'
  transition: transitions.SCALE,
}
export const wrapRootElement = ({ element }) => (
  <AlertProvider template={AlertTemplate} {...alertOptions}>
    <Auth0Provider
      domain={Auth0Domain}
      client_id={Auth0ClientID}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={Auth0Audience}
    >
      {element}
    </Auth0Provider>
  </AlertProvider>
)
