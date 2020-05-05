import React, { useState } from "react"
import formStyles from "./index.module.css"
import InfluencerStyles from "../../styles/influencer.module.css"
import { useAuth0 } from "../../utils/auth"
import useFetch from "../../hooks/useFetch"
import Alert from "../alert"

export default function () {
  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [successMsg, setSuccessMsg] = useState(null)
  const { isLoading: isFetching, response, error, fetchData } = useFetch()
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

  const clearInput = () => {
    setName("")
    setHandle("")
    setDescription("")
    setSelectedTags([])
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const postBody = { name, description, handle, tags: selectedTags }
    try {
      await fetchData("/api/influencer", "POST", postBody, true)
      setSuccessMsg(`Success! An admin will review.`)
      clearInput()
      setTimeout(() => {
        setSuccessMsg(null)
      }, 2000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form className={formStyles.influencerForm} onSubmit={handleSubmit}>
      {successMsg && <Alert msg={successMsg} />}
      <label htmlFor="name" className={formStyles.label}>
        What's the person's name?
      </label>
      <input
        type="text"
        name="name"
        placeholder="ex. James Quick"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={formStyles.input}
      />
      <label htmlFor="handle" className={formStyles.label}>
        What's the person's Twitter handle? (don't include @)
      </label>
      <input
        type="text"
        name="handle"
        placeholder="ex. jamesqquick"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        className={formStyles.input}
      />
      <label htmlFor="handle" className={formStyles.label}>
        Tell us a little bit about thie person
      </label>
      <textarea
        name="name"
        placeholder="ex. So and so does lots of cool stuff"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={formStyles.textArea}
        rows="5"
      />
      <label htmlFor="tags" className={formStyles.label}>
        What is this person good at?
      </label>
      <div className={InfluencerStyles.tagsList}>
        {tags.map((tag, index) => (
          <span
            className={
              selectedTags.includes(tag)
                ? InfluencerStyles.tagSelected
                : InfluencerStyles.tag
            }
            key={index}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
      <button className={formStyles.btn}>Submit</button>
    </form>
  )
}
