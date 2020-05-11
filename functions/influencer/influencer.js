const { updateInfluencer } = require("./updateInfluencer")
const { deleteInfluencer } = require("./deleteInfluencer")
const { addInfluencer } = require("./addInfluencer")
const { getInfluencers } = require("./getInfluencers")
exports.handler = async (event, context, callback) => {
  if (event.httpMethod === "GET") {
    return await getInfluencers(event, context, callback)
  } else if (event.httpMethod === "POST") {
    return await addInfluencer(event, context, callback)
  } else if (event.httpMethod === "DELETE") {
    return await deleteInfluencer(event, context, callback)
  } else if (event.httpMethod === "PUT") {
    return await updateInfluencer(event, context, callback)
  } else {
    return { statusCode: 400, body: JSON.stringify({}) }
  }
}
