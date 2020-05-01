import React from "react"
import Layout from "../components/layout"
import { useAuth0 } from "../utils/auth"
import { ProtectedRoute } from "../components/protected-route"
import { Navigation } from "../components/nav-bar"

const Account = () => {
  const {
    loading,
    user,
    isAuthenticated,
    checkUserForRole,
    availableRoles,
  } = useAuth0()

  const isContributor = checkUserForRole(availableRoles.INFLUENCER_CONTRIBUTOR)
  if (loading || !user) {
    return <p>Loading...</p>
  }

  return (
    <Layout>
      <ProtectedRoute>
        <Navigation />
        <p>Check out the user data supplied by Auth0, below:</p>
        {isAuthenticated && !isContributor && (
          <p>Make sure to verify your email address to become a contributor!</p>
        )}
        <pre>{isAuthenticated && JSON.stringify(user, null, 2)}</pre>
      </ProtectedRoute>
    </Layout>
  )
}

export default Account
