import React from "react"
import { useAuth0 } from "../utils/auth"

const useFetch = () => {
  const [response, setResponse] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { getTokenSilently } = useAuth0()

  const fetchData = async (url, method, body, authenticated, options = {}) => {
    setIsLoading(true)
    try {
      if (authenticated) {
        const token = await getTokenSilently()
        if (!options.headers) {
          options.headers = {}
        }
        options.headers["Authorization"] = `Bearer ${token}`
      }
      options.method = method
      if (method !== "GET") {
        options.body = JSON.stringify(body)
      }
      const res = await fetch(url, options)
      const json = await res.json()
      setResponse(json)
      setIsLoading(false)
      return json
    } catch (error) {
      setError(error)
      throw error
    }
  }
  return { response, error, isLoading, fetchData }
}

export default useFetch
