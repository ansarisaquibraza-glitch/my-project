// backend/middleware/validate.js
// Input validation middleware using express-validator

const { validationResult, body, param } = require('express-validator');

/**
 * Runs after validation chains — returns 400 if any errors found.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validation rules
const signupRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Report validation rules
const createReportRules = [
  body('damage_type')
    .trim()
    .notEmpty()
    .withMessage('Damage type is required')
    .isIn(['pothole', 'crack', 'flooding', 'collapse', 'other'])
    .withMessage('Invalid damage type'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Valid latitude required'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Valid longitude required'),
  body('reporter_name').trim().notEmpty().withMessage('Your name is required'),
  body('reporter_email').trim().isEmail().withMessage('Valid email is required'),
];

const updateStatusRules = [
  param('id').isUUID().withMessage('Invalid report ID'),
  body('status')
    .isIn(['pending', 'in_progress', 'resolved', 'rejected'])
    .withMessage('Invalid status value'),
];

module.exports = {
  handleValidation,
  signupRules,
  loginRules,
  createReportRules,
  updateStatusRules,
};
