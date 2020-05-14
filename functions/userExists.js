const { doesUserExist } = require("./utils/airtable")

exports.handler = async (event) => {
  const params = event.queryStringParameters
  const handle = params.handle
  if (!params.handle) {
    return {
      statusCode: 403,
      body: JSON.stringify({ err: "No handle included" }),
    }
  }
  try {
    const userExists = await doesUserExist(handle)
    return {
      statusCode: 200,
      body: JSON.stringify({ userExists }),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: err.message || "Something went wrong",
      }),
    }
  }
}
