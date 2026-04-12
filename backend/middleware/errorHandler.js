// backend/middleware/errorHandler.js
// Centralized error handling middleware

/**
 * Global error handler — catches all errors passed via next(err).
 * Returns consistent JSON error responses.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Validation errors from express-validator
  if (err.type === 'validation') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  // Supabase / DB errors
  if (err.code?.startsWith('PGRST') || err.code?.startsWith('23')) {
    return res.status(400).json({
      success: false,
      message: 'Database error',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Default internal server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

/**
 * 404 handler for unmatched routes
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};

module.exports = { errorHandler, notFound };
