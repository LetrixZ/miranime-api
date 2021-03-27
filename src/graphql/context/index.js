const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const verifyToken = async (token) => {
  try {
    if (!token) return null;
    if (token == process.env.TOKEN_SECRET) return true;
    else return false;
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
};

module.exports = async ({ req }) => {
  const token = (req.headers && req.headers.authorization)?.split(' ')[1] || '';
  const auth = await verifyToken(token);
  return { auth };
};
