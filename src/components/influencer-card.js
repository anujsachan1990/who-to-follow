import React from "react"
import CardStyles from "../styles/card.module.css"
import TagStyles from "../styles/tag.module.css"
import useFetch from "../hooks/useFetch"
export default function InfluencerCard({ influencer, influencerUpdated }) {
  const { fetchData } = useFetch()
  const approveOrRejectInfluencer = async (approved) => {
    const method = approved ? "PUT" : "DELETE"
    if (method === "DELETE") {
      const confirmed = window.confirm(
        "Are you sure you want to reject and delete this user?"
      )
      if (!confirmed) return
    }
    const id = influencer.recordId
    const postBody = { id, approved }

    try {
      await fetchData("/api/influencer", method, postBody, true)
      influencerUpdated(id, approved)
    } catch (err) {
      console.error(err)
    }
  }
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

        {!influencer.fields.approved && (
          <>
            {" "}
            <button onClick={() => approveOrRejectInfluencer(true)}>
              Approve
            </button>
            <button onClick={() => approveOrRejectInfluencer(false)}>
              Reject
            </button>
          </>
        )}
        {influencer.fields.approved && (
          <>
            {" "}
            <button onClick={() => approveOrRejectInfluencer(true)}>
              Upvote
            </button>
          </>
        )}
      </footer>
    </article>
  )
}
