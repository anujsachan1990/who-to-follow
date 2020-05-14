import React, { useState } from "react"
import CardStyles from "../styles/card.module.css"
import TagStyles from "../styles/tag.module.css"
import useFetch from "../hooks/useFetch"
export default function InfluencerCard({
  influencer,
  influencerUpdated,
  influencerUpvoted,
}) {
  console.log(influencer)
  const { fetchData } = useFetch()
  const [votes, setVotes] = useState(influencer.fields.votes)

  const approveInfluencer = async () => {
    const id = influencer.id
    const postBody = { id, approved: true }
    console.log(postBody)
    try {
      const res = await fetchData(
        "/.netlify/functions/approveInfluencer",
        "PUT",
        postBody,
        true
      )
      influencerUpdated(id, true)
    } catch (err) {
      console.error(err)
    }
  }

  const rejectInfluencer = async () => {
    const { id } = influencer
    const postBody = { id }

    try {
      await fetchData(
        "/.netlify/functions/influencer",
        "DELETE",
        postBody,
        true
      )
      influencerUpdated(id, false)
    } catch (err) {
      console.error(err)
    }
  }

  const upvoteInfluencer = async () => {
    const id = influencer.id
    const postBody = { id, votes: influencer.fields.votes + 1 }
    try {
      await fetchData("/.netlify/functions/influencer", "PUT", postBody, true)
      setVotes((prevVotes) => prevVotes + 1)
    } catch (err) {
      console.error(err)
    }
  }
  if (!influencer) return <></>
  return (
    <article key={influencer.id} className={CardStyles.card}>
      {/* {influencer.fields.approved && (
        <p className={CardStyles.badge}>
          <span onClick={upvoteInfluencer} role="img" aria-label="heart emoji">
            🧡
          </span>
          {votes}
        </p>
      )} */}
      <header className={CardStyles.header}>
        <img
          className={CardStyles.image}
          src={influencer.fields.image}
          alt=""
        />
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
            <button onClick={() => approveInfluencer()}>Approve</button>
            <button onClick={() => rejectInfluencer()}>Reject</button>
          </>
        )}
      </footer>
    </article>
  )
}
