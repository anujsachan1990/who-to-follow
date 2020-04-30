var jwt = require("jsonwebtoken")
const jwksClient = require("jwks-rsa")
const { promisify } = require("util")

let signingKey
const client = jwksClient({
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
})

const ROLES_NAMESPACE = "http://jqq-test.com/roles"

const checkUserForRole = (user, role) => {
  user.roles = user[ROLES_NAMESPACE]
  if (!user || !user.roles || !user.roles.includes(role)) {
    throw "User does not have the appropriate role"
  }
}

const availableRoles = {
  INFLUENCER_CONTRIBUTOR: "Influencer Contributor",
  INFLUENCER_SUPER_ADMIN: "Influencer Super Admin",
}

const checkHeaderForValidToken = async (headers) => {
  const rawAuthorizationHeader = headers["authorization"]

  if (!rawAuthorizationHeader) {
    throw "Unauthorized. No access token included"
  }

  const accessToken = rawAuthorizationHeader.split(" ")[1]
  if (!accessToken) {
    throw "Unauthorized. Token is invalid."
  }

  if (!signingKey) {
    const getSigningKey = promisify(client.getSigningKey)
    try {
      const key = await getSigningKey(process.env.AUTH0_KEY_ID)
      signingKey = key.getPublicKey()
    } catch (err) {
      console.error(err)
      throw "Failed to verify key"
    }
  }

  try {
    var decoded = jwt.verify(accessToken, signingKey)
  } catch (err) {
    console.error(err)
    throw err.message
  }

  if (!decoded) {
    throw "Failed to verify token"
  }
  return decoded
}

module.exports = {
  availableRoles,
  checkUserForRole,
  checkHeaderForValidToken,
}
