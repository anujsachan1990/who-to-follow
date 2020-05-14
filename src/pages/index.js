import React, { useEffect, useState, useCallback } from "react"
import { graphql } from "gatsby"
import "../styles/app.css"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Navigation } from "../components/nav-bar"
import TagStyles from "../styles/tag.module.css"
import CardStyles from "../styles/card.module.css"
import InfluencerCard from "../components/influencer-card"
import { useAuth0 } from "../utils/auth"
import { Link } from "@reach/router"

const Index = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const influencers = data.allAirtable.nodes
  const [visibleInfluencers, setVisibleInfluencers] = useState([...influencers])
  const [allTags, setAllTags] = useState([])
  const { user, loading } = useAuth0()

  useEffect(() => {
    const tags = new Set()
    influencers.forEach((influencer) => {
      if (influencer.fields.tags) {
        influencer.fields.tags.forEach((tag) => tags.add(tag))
      }
    })
    setAllTags(["all", ...Array.from(tags)])
  }, [influencers])

  const selectTag = (tag) => {
    if (tag === "all") {
      return setVisibleInfluencers([...influencers])
    }
    setVisibleInfluencers(
      influencers.filter((influencer) => influencer.fields.tags.includes(tag))
    )
  }

  const showUserTheAddPrompt = useCallback(() => {
    if (loading || !user) return false
    const isAlreadyIncluded = influencers.some(
      (influencer) => user.nickname === influencer.handle
    )
    return !isAlreadyIncluded
  }, [user, loading, influencers])

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Who To Follow" />
      <Navigation />
      <h1 className="title">Who To Follow</h1>
      <p className="subtitle">
        A list of developers on Twitter that you should follow
      </p>
      <hr />
      {!loading && !user && (
        <p>Login with Twitter to add yourself to the list</p>
      )}
      {showUserTheAddPrompt() && (
        <section className="centered">
          <p>Want to be included in this list?</p>
          <Link to="addYourself">
            <button className="button">Add Yourself</button>
          </Link>
        </section>
      )}
      <hr />
      <p>Filter by tag</p>
      <div className={TagStyles.list}>
        {allTags.map((tag, id) => (
          <span
            className={TagStyles.tag}
            key={id}
            onClick={() => selectTag(tag)}
            role="button"
            onKeyDown={() => selectTag(tag)}
            tabIndex={0}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className={CardStyles.list}>
        {visibleInfluencers.map((node) => {
          return <InfluencerCard influencer={node} key={node.id} />
        })}
      </div>
    </Layout>
  )
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allAirtable(filter: { data: { approved: { eq: true } } }) {
      nodes {
        id: recordId
        fields: data {
          name
          handle
          tags
          description
          approved
          votes
          website
          image
        }
      }
    }
  }
`
