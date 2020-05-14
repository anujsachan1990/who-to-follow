import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/app.css"
import { Navigation } from "../components/nav-bar"
import { AddInfluencerForm } from "../components/add-influencer-form"
import { ProtectedRoute } from "../components/protected-route"
import { useAuth0 } from "../utils/auth"

export default function AddYourself({ data, location, navigate }) {
  const siteTitle = data.site.siteMetadata.title
  const { user, loading } = useAuth0()
  const [userExists, setUserExists] = useState(null)

  useEffect(() => {
    const checkUserExists = async () => {
      if (!loading) {
        const res = await fetch(
          `/.netlify/functions/userExists?handle=${user.handle}`
        )
        const data = await res.json()
        setUserExists(data.userExists)
      }
    }
    checkUserExists()
  }, [user, loading])

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Add Yourself" />
      <ProtectedRoute>
        <Navigation />
        <h1 className="title">Add Yourself</h1>
        {userExists === true ? (
          <p>Looks like your user already exists.</p>
        ) : (
          <>
            <p className="subtitle">
              Think you would be a great follow? Just let us know which tags to
              associate with you and submit.
            </p>
            <AddInfluencerForm influencerSubmitted={() => navigate("/")} />
          </>
        )}
      </ProtectedRoute>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
