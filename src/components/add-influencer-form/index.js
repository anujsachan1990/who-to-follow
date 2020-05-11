import React, { useState } from "react"
import formStyles from "./index.module.css"
import TagStyles from "../../styles/tag.module.css"
import useFetch from "../../hooks/useFetch"
import Alert from "../alert"
import { useAuth0 } from "../../utils/auth"

export default function () {
  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
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
      setTimeout(() => {
        setErrorMsg(null)
      }, 2000)
      return setErrorMsg("All input fields are required. Including the tags :)")
    }
    if (description.length > 100) {
      setTimeout(() => {
        setErrorMsg(null)
      }, 2000)
      return setErrorMsg("Title should have a max of 100 characters")
    }
    const postBody = { name, description, handle, tags: selectedTags }
    try {
      //TODO: get the access token and attach it to the request
      const res = await fetch("/.netlify/functions/addInfluencer", {
        method: "POST",
        body: JSON.stringify(postBody),
      })
      if (res.status === 200) {
        setSuccessMsg(`Success! An admin will review.`)
        clearInput()
        setTimeout(() => {
          setSuccessMsg(null)
        }, 2000)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form className={formStyles.influencerForm} onSubmit={handleSubmit}>
      {successMsg && <Alert msg={successMsg} type="success" />}
      {errorMsg && <Alert msg={errorMsg} type="error" />}
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
