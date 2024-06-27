const jwt = require('jsonwebtoken');
require("dotenv").config();

// Set token secret and expiration date
const secret = process.env.JWT_SECRET;
const expiration = '2h';

module.exports = {
  // Function for our authenticated routes
  authMiddleware: function ({ req }) {
    // Allows token to be sent via req.query or headers
    let token = req.body.token || req.headers.authorization;

    // Check if token starts with "Bearer"
    if (req.headers.authorization && token.startsWith('Bearer ')) {
      token = token.slice(7); // Remove "Bearer " from token
    }

    if (!token) {
      return req;
    }

    // Verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret);
      req.user = data;
    } catch (err) {
      console.log('Invalid or expired token');
    }

    return req;
  },

  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};