import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import "../styles/app.css"
import { Navigation } from "../components/nav-bar"
import AddInfluencerForm from "../components/add-influencer-form"
import { ProtectedRoute } from "../components/protected-route"
import { useAuth0 } from "../utils/auth"

export default function AddInfluencer({ data, location }) {
  const siteTitle = data.site.siteMetadata.title
  const { availablePermissions, doesUserHavePermission } = useAuth0()

  const userCanCreate = doesUserHavePermission(
    availablePermissions.CREATE_INFLUENCER
  )
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Add Influencers" />
      <ProtectedRoute>
        <Navigation />
        <h1 className="title">Add an Influencer</h1>
        {!userCanCreate && (
          <p>You need to verify your email beefore you can add influencers</p>
        )}
        {userCanCreate && (
          <>
            <p className="subtitle">
              Know someone who is a great follow on Twitter? Feel free to add
              them to the list.
            </p>
            <AddInfluencerForm />
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
