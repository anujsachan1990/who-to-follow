require("dotenv").config()
const Airtable = require("airtable")
const {
  availablePermissions,
  doesUserHavePermission,
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

  const query = event.queryStringParameters["query"]
  //if we are trying to get unapproved influencers
  //then we need to do check for permissions
  if (query && query === "unapproved") {
    try {
      user = await checkHeaderForValidToken(event.headers)
      if (
        !doesUserHavePermission(user, availablePermissions.APPROVE_INFLUENCER)
      ) {
        throw "User does not have the appropriate permission"
      }
    } catch (err) {
      console.error(err)
      return {
        statusCode: 401,
        body: JSON.stringify({ msg: err }),
      }
    }

    try {
      const res = await table
        .select({
          filterByFormula: `{approved} = FALSE()`,
        })
        .firstPage()
      const formattedInfluencers = res.map((record) => ({
        id: record.id,
        fields: record.fields,
      }))
      returnBody = [...formattedInfluencers]
    } catch (err) {
      console.error(err)
      statusCode = 500
      returnBody = { msg: "Failed to query unapproved influencers in Airtable" }
    }
  } else {
    try {
      const res = await table
        .select({
          filterByFormula: `{approved} = TRUE()`,
        })
        .firstPage()
      const formattedInfluencers = res.map((record) => ({
        id: record.id,
        fields: record.fields,
      }))
      returnBody = [...formattedInfluencers]
    } catch (err) {
      console.error(err)
      statusCode = 500
      returnBody = { msg: "Failed to query influencers in Airtable" }
    }
  }
  return {
    statusCode,
    body: JSON.stringify(returnBody),
  }
}

module.exports = { getInfluencers }
