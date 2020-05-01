import React from "react"
import { Link } from "gatsby"
import { useAuth0 } from "../../utils/auth"
import css from "./index.module.css"

export const Navigation = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    loading,
    checkUserForRole,
    availableRoles,
  } = useAuth0()

  const isSuperAdmin = checkUserForRole(availableRoles.INFLUENCER_SUPER_ADMIN)
  return (
    <nav>
      {!isAuthenticated && !loading && (
        <button
          className={`${css.authButton} ${css["login"]}`}
          onClick={() =>
            loginWithRedirect({ appState: `${window.location.pathname}` })
          }
        >
          Log in
        </button>
      )}
      {isAuthenticated && (
        <>
          <button
            className={`${css.authButton} ${css["logout"]}`}
            onClick={() =>
              logout({
                returnTo: window.location.origin,
              })
            }
          >
            Log out
          </button>
          <Link className={css.navItem} to="/">
            Home
          </Link>
          <Link className={css.navItem} to="/addInfluencer">
            Add Influencer
          </Link>
          {isSuperAdmin && (
            <Link className={css.navItem} to="/dashboard">
              Dashboard
            </Link>
          )}

          <Link className={css.navItem} to="/account">
            My Account
          </Link>
        </>
      )}
    </nav>
  )
}
