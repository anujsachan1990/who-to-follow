import React, { useState } from "react"
import formStyles from "./index.module.css"
import TagStyles from "../../styles/tag.module.css"
import useFetch from "../../hooks/useFetch"
import { useAlert } from "react-alert"

export default function () {
  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
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
    if (!name || !description || !handle || selectedTags.length === 0) {
      return alert.error("All fields are required, including the tags")
    }
    if (description.length > 100) {
      return alert.error("Title should have a max of 100 characters")
    }
    const postBody = { name, description, handle, tags: selectedTags }
    try {
      await fetchData("/.netlify/functions/influencer", "POST", postBody, true)
      alert.success(`Success! An admin will review.`)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form className={formStyles.influencerForm} onSubmit={handleSubmit}>
      <label htmlFor="name" className={formStyles.label}>
        Name?
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
        Twitter handle? (excluding the @)
      </label>
      <input
        type="text"
        name="handle"
        placeholder="ex. jamesqquick"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        className={formStyles.input}
      />
      <label htmlFor="description" className={formStyles.label}>
        Title/Description (max 100 characters)
      </label>
      <input
        type="text"
        name="description"
        placeholder="ex. Developer Advocate at Cool Company"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={formStyles.input}
      />
      <small className={formStyles.info}>
        {`${description.length}/100`} characters
      </small>
      <label htmlFor="tags" className={formStyles.label}>
        What is this person good at?
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
  )
}
