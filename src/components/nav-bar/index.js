import React from "react"
import { Link } from "gatsby"
import { useAuth0 } from "../../utils/auth"
import css from "./index.module.css"

export const Navigation = () => {
  const { isAuthenticated, loginWithRedirect, logout, loading } = useAuth0()

  return (
    <nav className={css.nav}>
      <Link className={css.navItem} to="/">
        Home
      </Link>
      {isAuthenticated && (
        <>
          <Link className={css.navItem} to="/addInfluencer">
            Add
          </Link>
          <Link className={css.navItem} to="/account">
            My Account
          </Link>
          <button
            className={`${css.navItem} button`}
            onClick={() =>
              logout({
                returnTo: window.location.origin,
              })
            }
          >
            Log out
          </button>
        </>
      )}
      {!isAuthenticated && !loading && (
        <button
          className={`${css.navItem} button`}
          onClick={() =>
            loginWithRedirect({ appState: `${window.location.pathname}` })
          }
        >
          Log in
        </button>
      )}
    </nav>
  )
}
