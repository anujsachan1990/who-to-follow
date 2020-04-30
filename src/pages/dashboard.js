import React, { useEffect, useState } from "react"
import Layout from "../components/layout"
import { ProtectedRoute } from "../components/protected-route"
import SEO from "../components/seo"
import { Navigation } from "../components/nav-bar"
import { useAuth0 } from "../utils/auth"
import InfluencerStyles from "../styles/influencer.module.css"
import InfluencerCard from "../components/influencer-card"

export default function Dashboard({ location, data }) {
  const siteTitle = data.site.siteMetadata.title
  const { availableRoles, getTokenSilently, loading } = useAuth0()
  const [records, setRecords] = useState([])

  useEffect(() => {
    //query airtable for all nonapproved records
    const loadUnapprovedInfluencers = async () => {
      try {
        const token = await getTokenSilently()
        const url = "/api/unapprovedInfluencers"
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
        setRecords(data.records)
      } catch (err) {
        console.error(err)
      }
    }
    if (!loading) loadUnapprovedInfluencers()
  }, [loading])

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Add Influencers" />
      <ProtectedRoute role={availableRoles.INFLUENCER_SUPER_ADMIN}>
        <Navigation />
        <div className={InfluencerStyles.list}>
          {records.map((node) => {
            return <InfluencerCard node={node} key={node.id} />
          })}
        </div>
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
