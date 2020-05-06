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
  const { availableRoles } = useAuth0()

  const targetRoles = [
    availableRoles.INFLUENCER_SUPER_ADMIN,
    availableRoles.INFLUENCER_CONTRIBUTOR,
  ]
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Add Influencers" />
      <ProtectedRoute roles={targetRoles}>
        <Navigation />
        <h1 className="title">Add an Influencer</h1>
        <p className="subtitle">
          Know someone who is a great follow on Twitter? Feel free to add them
          to the list.
        </p>
        <AddInfluencerForm />
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
