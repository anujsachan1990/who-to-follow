import { useEffect } from "react"
import { useAuth0 } from "../utils/auth"
import { navigate } from "gatsby"

export const ProtectedRoute = ({ children, role }) => {
  const {
    loading,
    isAuthenticated,
    loginWithRedirect,
    availableRoles,
    checkUserForRole,
  } = useAuth0()
  useEffect(() => {
    if (loading) return undefined
    if (isAuthenticated && !role) return undefined
    if (checkUserForRole(role)) {
      return undefined
    } else {
      //if user is authenticated but doesn't have the right role, send them home
      return navigate("/")
    }
    const asyncLogin = async () => {
      await loginWithRedirect({
        appState: { targetUrl: window.location.pathname },
      })
    }
    asyncLogin()
  }, [loading, isAuthenticated, loginWithRedirect])
  return children
}
