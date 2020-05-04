require("dotenv").config()
const Airtable = require("airtable")

const {
  availableRoles,
  checkUserForRole,
  checkHeaderForValidToken,
} = require("../utils/auth")
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
})
const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
const table = base(process.env.AIRTABLE_TABLE_NAME)

const getInfluencers = async (event, context, callback) => {
  let statusCode = 200
  let returnBody = {}
  console.log(event)

  try {
    const res = await table
      .select({
        filterByFormula: `{approved} = TRUE()`,
      })
      .firstPage()
    const formattedInfluencers = res.map((record) => ({
      recordId: record.id,
      fields: record.fields,
    }))
    returnBody = [...formattedInfluencers]
  } catch (err) {
    console.error(err)
    statusCode = 500
    returnBody = { msg: "Failed to query unapproved influencers in Airtable" }
  }
  return {
    statusCode,
    body: JSON.stringify(returnBody),
  }
}

module.exports = { getInfluencers }
