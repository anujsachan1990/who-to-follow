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

const addInfluencer = async (event, context, callback) => {
  try {
    user = await checkHeaderForValidToken(event.headers)
    if (
      !checkUserForRole(user, [
        availableRoles.INFLUENCER_CONTRIBUTOR,
        availableRoles.INFLUENCER_SUPER_ADMIN,
      ])
    ) {
      throw "User does not have the appropriate role"
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 401,
      body: JSON.stringify({ msg: err }),
    }
  }

  const body = JSON.parse(event.body)
  let statusCode = 200
  let returnBody = {}
  if (!body.name || !body.handle || !body.tags) {
    statusCode = 403
    returnBody = {
      msg: "Each influencer must include a name, handle, and tags",
    }
  } else {
    try {
      body.approved = false
      body.votes = 0
      const record = await table.create(body)
      returnBody = { record }
    } catch (err) {
      console.error(err)
      statusCode = 500
      returnBody = { msg: "Failed to create record in Airtable" }
    }
  }
  return {
    statusCode,
    body: JSON.stringify(returnBody),
  }
}

module.exports = { addInfluencer }
