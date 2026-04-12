// backend/routes/reports.js
const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  getStats,
  exportReports,
} = require('../controllers/reportsController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { createReportRules, updateStatusRules, handleValidation } = require('../middleware/validate');

// Public routes
router.get('/', getAllReports);
router.get('/stats/summary', getStats);
router.get('/export', authenticate, requireAdmin, exportReports);
router.get('/:id', getReportById);

// Authenticated routes (citizen can submit without login, but optionally authenticated)
router.post('/', createReportRules, handleValidation, createReport);

// Admin-only routes
router.put('/:id', authenticate, requireAdmin, updateStatusRules, handleValidation, updateReport);
router.delete('/:id', authenticate, requireAdmin, deleteReport);

module.exports = router;
