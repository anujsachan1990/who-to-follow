require("dotenv").config()
const axios = require("axios")
const Airtable = require("airtable")

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
})
const {
  availableRoles,
  checkUserForRole,
  checkHeaderForValidToken,
} = require("../utils/auth")
const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
const table = base(process.env.AIRTABLE_TABLE_NAME)

const updateInfluencer = async (event, context, callback) => {
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

  let statusCode = 200
  let returnBody = {}
  const { id, approved } = JSON.parse(event.body)
  if (!id || approved === undefined) {
    statusCode = 400
    returnBody = {
      msg:
        "Must include an id and whether or not the influencer is approved or rejected",
    }
  } else {
    try {
      const updatedRecord = await table.update(id, { approved })
      returnBody = { record: updatedRecord }
    } catch (err) {
      console.error(err)
      statusCode = 500
      returnBody = { msg: "Failed to create record in Airtable" }
    }
    //if the user has been approved, trigger a rebuild so that
    //the user will now show up in the index page
    if (approved) {
      try {
        await axios.post(process.env.NETLIFY_BUILD_HOOK)
      } catch (err) {
        console.error(err)
        statusCode = 500
        returnBody = { msg: "Failed to trigger build in Netlify" }
      }
    }
  }

  return {
    statusCode,
    body: JSON.stringify(returnBody),
  }
}
module.exports = { updateInfluencer }
