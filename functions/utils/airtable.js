require("dotenv").config()
const Airtable = require("airtable")
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
})
const base = Airtable.base(process.env.AIRTABLE_BASE_ID)
const table = base(process.env.AIRTABLE_TABLE_NAME)

const doesUserExist = async (handle) => {
  try {
    const filter = `handle = "${handle}"`
    const existingUsers = await table
      .select({ filterByFormula: filter })
      .firstPage()
    return existingUsers.length > 0
  } catch (err) {
    console.log("err")
    throw err
  }
}
module.exports = { base, table, doesUserExist }
