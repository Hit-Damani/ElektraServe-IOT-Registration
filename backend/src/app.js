const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const Format = require('./config/format');

const app = express();

// Enable CORS for client application (supports any local dev port)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// API Routes
app.use('/api', routes);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json(Format.notFound(null, `Endpoint ${req.method} ${req.originalUrl} not found`));
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
