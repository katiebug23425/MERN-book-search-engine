const express = require('express');
const path = require('path');
require("dotenv").config();
const db = require('./config/connection');

const { ApolloServer } = require('apollo-server-express');
const { expressMiddleware } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

// Setup Apollo Server and use typeDefs, resolvers, and auth for context
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware(req),
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Apply Apollo Server middleware to the Express app
server.applyMiddleware({ app });

// Start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});