const express = require('express');
const router = express.Router();
const LicenseController = require('../controllers/LicenseController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validate, licenseValidation } = require('../middleware/validation');
const { body } = require('express-validator');

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorize('OYAKATASAMA'));

// Get license statistics
router.get('/statistics', LicenseController.getLicenseStatistics);

// Get expiring licenses
router.get('/expiring', LicenseController.checkExpiringLicenses);

// Get all licenses
router.get('/', LicenseController.getAllLicenses);

// Get license by ID
router.get('/:id', LicenseController.getLicenseById);

// Create license
router.post('/',
  validate(licenseValidation.create),
  LicenseController.createLicense
);

// Update license
router.put('/:id', LicenseController.updateLicense);

// Revoke license
router.put('/:id/revoke', LicenseController.revokeLicense);

// Delete license
router.delete('/:id', LicenseController.deleteLicense);

// Assign license to user
router.post('/:id/assign',
  validate([
    body('userId').isInt().withMessage('User ID is required')
  ]),
  LicenseController.assignLicenseToUser
);

// Remove license from user
router.delete('/:id/users',
  validate([
    body('userId').isInt().withMessage('User ID is required')
  ]),
  LicenseController.removeLicenseFromUser
);

module.exports = router;
