import React from "react"
import InfluencerStyles from "../styles/influencer.module.css"

export default function InfluencerCard({ influencer, children }) {
  if (!influencer) return <></>
  return (
    <article key={influencer.recordId} className={InfluencerStyles.influencer}>
      <header className={InfluencerStyles.header}>
        <h3 className={InfluencerStyles.handle}>
          <a
            href={"https://www.twitter.com/" + influencer.fields.handle}
            rel="noopener noreferrer"
            target="_blank"
          >
            @{influencer.fields.handle}
          </a>
        </h3>
        <p className={InfluencerStyles.name}>{influencer.fields.name}</p>
      </header>
      <div className={InfluencerStyles.body}>
        <p className={InfluencerStyles.description}>
          {influencer.fields.description}
        </p>
      </div>
      <footer className={InfluencerStyles.footer}>
        <div className={InfluencerStyles.tagsList}>
          {influencer.fields.tags &&
            influencer.fields.tags.map((tag, index) => (
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
        {children && <hr />}
        {children}
      </footer>
    </article>
  )
}
