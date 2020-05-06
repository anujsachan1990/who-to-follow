import { useEffect } from "react"
import { useAuth0 } from "../utils/auth"
import { navigate } from "gatsby"

export const ProtectedRoute = ({ children, roles }) => {
  const {
    loading,
    isAuthenticated,
    loginWithRedirect,
    checkUserForRole,
  } = useAuth0()
  useEffect(() => {
    if (loading) return undefined
    if (isAuthenticated && !roles) return undefined
    if (checkUserForRole(roles)) {
      return undefined
    } else {
      //if user is authenticated but doesn't have the right role, send them home
      return navigate("/")
    }
  }, [loading, isAuthenticated, loginWithRedirect, checkUserForRole, roles])
  return children
}
