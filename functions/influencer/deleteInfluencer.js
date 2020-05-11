require("dotenv").config()
const Airtable = require("airtable")

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
})
const {
  availablePermissions,
  doesUserHavePermission,
  checkHeaderForValidToken,
} = require("../utils/auth")
const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
const table = base(process.env.AIRTABLE_TABLE_NAME)

const deleteInfluencer = async (event, context, callback) => {
  try {
    user = await checkHeaderForValidToken(event.headers)
    if (!doesUserHavePermission(user, availablePermissions.DELETE_INFLUENCER)) {
      throw "User does not have the appropriate permission"
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
  const { id } = JSON.parse(event.body)
  if (!id) {
    statusCode = 400
    returnBody = {
      msg: "Must include an id.",
    }
  } else {
    try {
      const updatedRecord = await table.destroy(id)
      returnBody = { record: updatedRecord }
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
module.exports = { deleteInfluencer }
