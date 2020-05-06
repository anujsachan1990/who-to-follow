import React from "react"
import CardStyles from "../styles/card.module.css"
import TagStyles from "../styles/tag.module.css"
export default function InfluencerCard({ influencer, children }) {
  if (!influencer) return <></>
  return (
    <article key={influencer.recordId} className={CardStyles.card}>
      <header className={CardStyles.header}>
        <h3 className={CardStyles.title}>
          <a
            href={"https://www.twitter.com/" + influencer.fields.handle}
            rel="noopener noreferrer"
            target="_blank"
          >
            @{influencer.fields.handle}
          </a>
        </h3>
        <p className={CardStyles.subtitle}>{influencer.fields.name}</p>
      </header>
      <div className={CardStyles.body}>
        <p className={CardStyles.description}>
          {influencer.fields.description}
        </p>
      </div>
      <footer className={CardStyles.footer}>
        <div className={TagStyles.tagsList}>
          {influencer.fields.tags &&
            influencer.fields.tags.map((tag, index) => (
              <small
                className={TagStyles.tag}
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
