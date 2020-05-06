require("dotenv").config()
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
  const { approved, id, votes } = JSON.parse(event.body)
  console.log(JSON.parse(event.body))
  if (approved !== undefined) {
    return {
      statusCode: 401,
      body: JSON.stringify({ msg: "You can't update that here" }),
    }
  }

  try {
    const updatedRecord = await table.update(id, { votes })
    return {
      statusCode: 200,
      body: JSON.stringify({ updatedRecord }),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Failed to update record in Airtable" }),
    }
  }
}
module.exports = { updateInfluencer }
