import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import { ProtectedRoute } from "../components/protected-route"
import SEO from "../components/seo"
import { Navigation } from "../components/nav-bar"
import { useAuth0 } from "../utils/auth"
import InfluencerStyles from "../styles/influencer.module.css"
import InfluencerApprovalCard from "../components/InfluencerApprovalCard"

export default function Dashboard({ location, data }) {
  const siteTitle = data.site.siteMetadata.title
  const { availableRoles, getTokenSilently, loading } = useAuth0()

  const targetRoles = [availableRoles.INFLUENCER_SUPER_ADMIN]
  const [records, setRecords] = useState([])
  const [loadingInfluencers, setLoadingInfluencers] = useState(true)

  useEffect(() => {
    //query airtable for all nonapproved records
    const loadUnapprovedInfluencers = async () => {
      try {
        const token = await getTokenSilently()
        const url = "/api/influencer?query=unapproved"
        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (res.status !== 200) {
          console.error("Failed to query influencers")
        }
        const data = await res.json()
        setRecords(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingInfluencers(false)
      }
    }
    if (!loading) loadUnapprovedInfluencers()
  }, [loading, getTokenSilently])

  const handleInfluencerUpdated = (id) => {
    console.log("influencer updated", id)
    console.log(records.filter((record) => record.id !== id))
    setRecords((prevRecords) =>
      prevRecords.filter((record) => record.recordId !== id)
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Add Influencers" />
      <ProtectedRoute roles={targetRoles}>
        <Navigation />
        <h1 className="title">Admin Dashboard</h1>
        <p className="subtitle"></p>
        <h2>Influencers Waiting for Approval</h2>
        {loadingInfluencers && <p>Loading...</p>}
        {!loadingInfluencers && (
          <div className={InfluencerStyles.list}>
            {records.map((node) => {
              return (
                <InfluencerApprovalCard
                  influencer={node}
                  key={node.recordId}
                  influencerUpdated={handleInfluencerUpdated}
                />
              )
            })}
          </div>
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
