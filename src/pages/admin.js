import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import { ProtectedRoute } from "../components/protected-route"
import SEO from "../components/seo"
import { Navigation } from "../components/nav-bar"
import { useAuth0 } from "../utils/auth"
import CardStyles from "../styles/card.module.css"
import InfluencerCard from "../components/influencer-card"
import useFetch from "../hooks/useFetch"
import { useAlert } from "react-alert"

export default function Dashboard({ location, data }) {
  const siteTitle = data.site.siteMetadata.title
  const { availablePermissions } = useAuth0()
  const [successMsg, setsuccessMsg] = useState(null)
  const { isLoading: loadingInfluencers, fetchData } = useFetch()
  const [records, setRecords] = useState([])
  // const alert = useAlert()

  const targetPermissions = [availablePermissions.APPROVE_INFLUENCER]

  useEffect(() => {
    //query airtable for all nonapproved records
    const loadUnapprovedInfluencers = async () => {
      try {
        const data = await fetchData(
          "/.netlify/functions/influencer?query=unapproved",
          "GET",
          {},
          true
        )
        setRecords(data)
      } catch (err) {
        console.error(err)
      }
    }
    loadUnapprovedInfluencers()
  }, [])

  const handleInfluencerUpdated = (id, approved) => {
    const msg = "User successfully " + (approved ? "approved" : "rejected")
    // alert.success(msg)
    setRecords((prevRecords) =>
      prevRecords.filter((record) => record.id !== id)
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Add Influencers" />
      <ProtectedRoute permissions={targetPermissions}>
        <Navigation />
        <h1 className="title">Admin Dashboard</h1>
        <p className="subtitle"></p>
        <h3>Influencers Waiting for Approval</h3>
        {loadingInfluencers && <p>Loading...</p>}
        {!loadingInfluencers && records.length === 0 && (
          <p>Great work! There are no pending submissions.</p>
        )}
        {!loadingInfluencers && records.length > 0 && (
          <div className={CardStyles.list}>
            {records.map((node) => {
              return (
                <InfluencerCard
                  influencer={node}
                  key={node.id}
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
