import { useEffect } from "react"
import { useAuth0 } from "../utils/auth"
import { navigate } from "gatsby"

export const ProtectedRoute = ({ children, permission }) => {
  const {
    loading,
    isAuthenticated,
    loginWithRedirect,
    doesUserHavePermission,
  } = useAuth0()
  useEffect(() => {
    if (loading) return undefined
    if (isAuthenticated && !permission) return undefined
    if (doesUserHavePermission(permission)) {
      return undefined
    } else {
      //if user is authenticated but doesn't have the right permission, send them home
      return navigate("/")
    }
  }, [
    loading,
    isAuthenticated,
    loginWithRedirect,
    doesUserHavePermission,
    permission,
  ])
  return children
}
