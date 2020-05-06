import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import "../styles/app.css"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Navigation } from "../components/nav-bar"
import TagStyles from "../styles/tag.module.css"
import CardStyles from "../styles/card.module.css"
import InfluencerCard from "../components/influencer-card"

const Index = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const influencers = data.allAirtable.nodes
  const [visibleInfluencers, setVisibleInfluencers] = useState([...influencers])
  const [allTags, setAllTags] = useState([])

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
  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All Influencers" />
      <Navigation />
      <h1 className="title">Who To Follow</h1>
      <p className="subtitle">
        A list of developers on Twitter that you should follow!
      </p>
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
        }
      }
    }
  }
`
