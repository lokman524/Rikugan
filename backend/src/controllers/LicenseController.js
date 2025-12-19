const LicenseService = require('../services/LicenseService');

class LicenseController {
  async getAllLicenses(req, res, next) {
    try {
      const licenses = await LicenseService.getAllLicenses(req.query);

      res.json({
        success: true,
        data: licenses
      });
    } catch (error) {
      next(error);
    }
  }

  async getLicenseById(req, res, next) {
    try {
      const license = await LicenseService.getLicenseById(req.params.id);

      res.json({
        success: true,
        data: license
      });
    } catch (error) {
      next(error);
    }
  }

  async createLicense(req, res, next) {
    try {
      const license = await LicenseService.createLicense(req.body);

      res.status(201).json({
        success: true,
        message: 'License created successfully',
        data: license
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLicense(req, res, next) {
    try {
      const license = await LicenseService.updateLicense(req.params.id, req.body);

      res.json({
        success: true,
        message: 'License updated successfully',
        data: license
      });
    } catch (error) {
      next(error);
    }
  }

  async revokeLicense(req, res, next) {
    try {
      const license = await LicenseService.revokeLicense(req.params.id);

      res.json({
        success: true,
        message: 'License revoked successfully',
        data: license
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLicense(req, res, next) {
    try {
      await LicenseService.deleteLicense(req.params.id);

      res.json({
        success: true,
        message: 'License deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async assignLicenseToUser(req, res, next) {
    try {
      await LicenseService.assignLicenseToUser(req.params.id, req.body.userId);

      res.json({
        success: true,
        message: 'License assigned to user successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async removeLicenseFromUser(req, res, next) {
    try {
      await LicenseService.removeLicenseFromUser(req.params.id, req.body.userId);

      res.json({
        success: true,
        message: 'License removed from user successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async checkExpiringLicenses(req, res, next) {
    try {
      const licenses = await LicenseService.checkExpiringLicenses(req.query.days || 7);

      res.json({
        success: true,
        data: licenses
      });
    } catch (error) {
      next(error);
    }
  }

  async getLicenseStatistics(req, res, next) {
    try {
      const stats = await LicenseService.getLicenseStatistics();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LicenseController();
