import React from "react"
import InfluencerCard from "../components/influencer-card"
import { useAuth0 } from "../utils/auth"

export default function InfluencerApprovalCard({
  influencer,
  influencerUpdated,
}) {
  const { getTokenSilently } = useAuth0()
  if (!influencer) return <></>

  const approveOrRejectInfluencer = async (approved) => {
    const id = influencer.recordId
    const method = approved ? "PUT" : "DELETE"
    if (
      method === "DELETE" &&
      !window.confirm("Are you sure you want to delete this user?")
    )
      return
    try {
      const postBody = { id, approved }
      const token = await getTokenSilently()
      const url = "/api/influencer"
      const res = await fetch(url, {
        method: method,
        body: JSON.stringify(postBody),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status !== 200) {
        console.error("Failed to create influencer")
      } else {
        influencerUpdated(id, approved)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <InfluencerCard influencer={influencer}>
      <button onClick={() => approveOrRejectInfluencer(true)}>Approve</button>
      <button onClick={() => approveOrRejectInfluencer(false)}>Reject</button>
    </InfluencerCard>
  )
}
