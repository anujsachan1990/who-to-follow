import React from "react"
import Layout from "../components/layout"
import { useAuth0 } from "../utils/auth"
import { ProtectedRoute } from "../components/protected-route"
import { Navigation } from "../components/nav-bar"

const Profile = ({ children }) => {
  const { loading, user } = useAuth0()
  return loading || !user ? <p>Loading...</p> : <>{children}</>
}

const Account = () => {
  const { isAuthenticated, user } = useAuth0()
  return (
    <Layout>
      <ProtectedRoute>
        <h1>Account</h1>
        <Navigation />
        <Profile>
          <p>Check out the user data supplied by Auth0, below:</p>
          <pre>{isAuthenticated && JSON.stringify(user, null, 2)}</pre>
        </Profile>
      </ProtectedRoute>
    </Layout>
  )
}

export default Account
