import React, { useState, useEffect } from "react"
import formStyles from "./index.module.css"
import TagStyles from "../../styles/tag.module.css"
import useFetch from "../../hooks/useFetch"
import { useAlert } from "react-alert"
import { useAuth0 } from "../../utils/auth"

export const AddInfluencerForm = ({ influencerSubmitted }) => {
  const MAX_DESCRIPTION_CHARACTERS = 170
  const { user } = useAuth0()

  const [selectedTags, setSelectedTags] = useState([])

  const { fetchData } = useFetch()
  const alert = useAlert()
  const tags = [
    "accessibility",
    "css",
    "gatsby",
    "html",
    "javascript",
    "frontend",
    "backend",
    "node",
    "react",
    "vue",
    "design",
  ]

  useEffect(() => {})

  const toggleTag = (tag) => {
    const index = selectedTags.indexOf(tag)
    if (index === -1) {
      setSelectedTags((prevTags) => [...prevTags, tag])
    } else {
      setSelectedTags((prevTags) =>
        prevTags.filter((prevTag) => prevTag !== tag)
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const body = {
      ...user,
      tags: selectedTags,
    }
    try {
      const res = await fetchData(
        "/.netlify/functions/influencer",
        "POST",
        body,
        true
      )
      alert.success(`Success! Updates are batched so check back tomorrow`)
      influencerSubmitted()
    } catch (err) {
      console.error(err)
      alert.error(err.msg || "Something went wrong")
    }
  }

  return (
    <>
      <form className={formStyles.influencerForm} onSubmit={handleSubmit}>
        <label htmlFor="tags" className={formStyles.label}>
          What do you focus on?
        </label>
        <div className={TagStyles.tagsList}>
          {tags.map((tag, index) => (
            <span
              className={`${TagStyles.tag} ${
                selectedTags.includes(tag) && TagStyles.selected
              }`}
              key={index}
              role="button"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        <button className="button">Submit</button>
      </form>
    </>
  )
}
