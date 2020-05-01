require("dotenv").config()
const Airtable = require("airtable")

const {
  availableRoles,
  checkUserForRole,
  checkHeaderForValidToken,
} = require("./utils/auth")
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
})
const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
const table = base(process.env.AIRTABLE_TABLE_NAME)

exports.handler = async (event, context, callback) => {
  try {
    user = await checkHeaderForValidToken(event.headers)
    if (!checkUserForRole(user, [availableRoles.INFLUENCER_SUPER_ADMIN])) {
      throw "User does not have the appropriate role"
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 401,
      body: JSON.stringify({ msg: err }),
    }
  }

  let statusCode = 200
  let returnBody = {}

  try {
    const records = await table
      .select({
        filterByFormula: `{approved} = FALSE()`,
      })
      .firstPage()
    returnBody = { records }
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
