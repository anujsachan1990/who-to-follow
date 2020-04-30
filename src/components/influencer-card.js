import React from "react"
import InfluencerStyles from "../styles/influencer.module.css"

export default function InfluencerCard({ node }) {
  if (!node) return <></>
  return (
    <article key={node.recordId} className={InfluencerStyles.influencer}>
      <header>
        <h3 className={InfluencerStyles.name}>
          <a
            href={"https://www.twitter.com/" + node.fields.handle}
            rel="noopener noreferrer"
            target="_blank"
          >
            {node.fields.name}
          </a>
        </h3>
        <p className={InfluencerStyles.handle}>@{node.fields.handle}</p>
        <p className={InfluencerStyles.description}>
          {node.fields.description}
        </p>
        <div className={InfluencerStyles.tagsList}>
          {node.fields.tags &&
            node.fields.tags.map((tag, index) => (
              <small
                className={InfluencerStyles.tag}
                key={index}
                role="button"
                tabIndex={0}
              >
                {tag}
              </small>
            ))}
        </div>
      </header>
    </article>
  )
}
