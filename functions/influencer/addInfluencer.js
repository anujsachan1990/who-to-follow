require("dotenv").config()
const { table, doesUserExist } = require("../utils/airtable")
const {
  availablePermissions,
  doesUserHavePermission,
  checkHeaderForValidToken,
} = require("../utils/auth")

const addInfluencer = async (event, context, callback) => {
  try {
    user = await checkHeaderForValidToken(event.headers)
    if (!doesUserHavePermission(user, availablePermissions.CREATE_INFLUENCER)) {
      throw "User does not have the appropriate permission"
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 401,
      body: JSON.stringify({ msg: err }),
    }
  }

  const { name, handle, image, tags, description, website } = JSON.parse(
    event.body
  )
  if (!name || !handle || !tags || tags.length === 0 || !description) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        msg: "Invalid input",
      }),
    }
  } else {
    try {
      //check if the handle already exists
      const alreadyExists = await doesUserExist(handle)
      if (alreadyExists) {
        return {
          statusCode: 500,
          body: JSON.stringify({ msg: "User already exists" }),
        }
      }

      const body = {
        name,
        handle,
        image,
        description,
        approved: false,
        votes: 0,
        tags,
        website,
      }
      console.log(body)

      const record = await table.create(body)
      return {
        statusCode: 200,
        body: JSON.stringify(record),
      }
    } catch (err) {
      console.error(err)
      return {
        statusCode: 500,
        body: JSON.stringify({
          msg: err.message || "Failed to create record in Airtable",
        }),
      }
    }
  }
}

module.exports = { addInfluencer }
