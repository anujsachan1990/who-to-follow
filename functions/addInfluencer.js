require("dotenv").config()
const Airtable = require("airtable")

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
})
const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
const table = base(process.env.AIRTABLE_TABLE_NAME)

exports.handler = async (event) => {
  const body = JSON.parse(event.body)
  if (!body.name || !body.handle || !body.tags || body.tags.length === 0) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        msg: "Each influencer must include a name, handle, and tags",
      }),
    }
  } else {
    try {
      body.approved = false
      body.votes = 0
      const record = await table.create(body)
      return {
        statusCode: 200,
        body: JSON.stringify({ record }),
      }
    } catch (err) {
      console.error(err)
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: "Failed to create record in Airtable" }),
      }
    }
  }
}
