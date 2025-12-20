const TeamService = require('../services/TeamService');

/**
 * TeamController
 * 
 * Handles team management operations including creation, updates,
 * member management, and team statistics.
 */
class TeamController {
  /**
   * Create a new team
   * 
   * POST /api/v1/teams
   * 
   * Request:
   * - Body:
   *   {
   *     name: string (required, 3-100 chars),
   *     description: string (optional),
   *     licenseKey: string (required)
   *   }
   * 
   * Response:
   * {
   *   success: true,
   *   message: string,
   *   data: {
   *     id: number,
   *     name: string,
   *     description: string,
   *     isActive: boolean,
   *     createdBy: number
   *   }
   * }
   */
  async createTeam(req, res, next) {
    try {
      const { name, description, licenseKey } = req.body;

      if (!name || !licenseKey) {
        return res.status(400).json({
          success: false,
          message: 'Team name and license key are required'
        });
      }

      const team = await TeamService.createTeam(
        { name, description, licenseKey },
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: 'Team created successfully',
        data: team
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get team by ID
   * 
   * GET /api/v1/teams/:id
   * 
   * Response:
   * {
   *   success: true,
   *   data: {
   *     id: number,
   *     name: string,
   *     description: string,
   *     isActive: boolean,
   *     members: Array,
   *     license: Object
   *   }
   * }
   */
  async getTeamById(req, res, next) {
    try {
      const { id } = req.params;
      const team = await TeamService.getTeamById(id);

      if (!team) {
        return res.status(404).json({
          success: false,
          message: 'Team not found'
        });
      }

      res.json({
        success: true,
        data: team
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all teams with pagination
   * 
   * GET /api/v1/teams?page=1&limit=10&search=teamname
   * 
   * Response:
   * {
   *   success: true,
   *   data: {
   *     teams: Array,
   *     pagination: {
   *       total: number,
   *       page: number,
   *       limit: number,
   *       totalPages: number
   *     }
   *   }
   * }
   */
  async getAllTeams(req, res, next) {
    try {
      const { page, limit, search } = req.query;
      const result = await TeamService.getAllTeams({ page, limit, search });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update team
   * 
   * PUT /api/v1/teams/:id
   * 
   * Request:
   * - Body:
   *   {
   *     name: string (optional),
   *     description: string (optional),
   *     isActive: boolean (optional)
   *   }
   * 
   * Response:
   * {
   *   success: true,
   *   message: string,
   *   data: Object
   * }
   */
  async updateTeam(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const team = await TeamService.updateTeam(id, updateData);

      res.json({
        success: true,
        message: 'Team updated successfully',
        data: team
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete/deactivate team
   * 
   * DELETE /api/v1/teams/:id
   * 
   * Response:
   * {
   *   success: true,
   *   message: string
   * }
   */
  async deleteTeam(req, res, next) {
    try {
      const { id } = req.params;
      await TeamService.deleteTeam(id);

      res.json({
        success: true,
        message: 'Team deactivated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add member to team
   * 
   * POST /api/v1/teams/:id/members
   * 
   * Request:
   * - Body:
   *   {
   *     userId: number (required)
   *   }
   * 
   * Response:
   * {
   *   success: true,
   *   message: string,
   *   data: Object
   * }
   */
  async addMember(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const user = await TeamService.addMember(id, userId);

      res.json({
        success: true,
        message: 'Member added successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove member from team
   * 
   * DELETE /api/v1/teams/:id/members/:userId
   * 
   * Response:
   * {
   *   success: true,
   *   message: string
   * }
   */
  async removeMember(req, res, next) {
    try {
      const { id, userId } = req.params;
      await TeamService.removeMember(id, userId);

      res.json({
        success: true,
        message: 'Member removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get team members
   * 
   * GET /api/v1/teams/:id/members
   * 
   * Response:
   * {
   *   success: true,
   *   data: Array
   * }
   */
  async getTeamMembers(req, res, next) {
    try {
      const { id } = req.params;
      const members = await TeamService.getTeamMembers(id);

      res.json({
        success: true,
        data: members
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get team statistics
   * 
   * GET /api/v1/teams/:id/statistics
   * 
   * Response:
   * {
   *   success: true,
   *   data: {
   *     memberCount: number,
   *     totalTasks: number,
   *     completedTasks: number,
   *     inProgressTasks: number,
   *     totalEarnings: number
   *   }
   * }
   */
  async getTeamStatistics(req, res, next) {
    try {
      const { id } = req.params;
      const stats = await TeamService.getTeamStatistics(id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user's team
   * 
   * GET /api/v1/teams/my-team
   * 
   * Response:
   * {
   *   success: true,
   *   data: Object
   * }
   */
  async getMyTeam(req, res, next) {
    try {
      if (!req.user.teamId) {
        return res.status(404).json({
          success: false,
          message: 'You are not a member of any team'
        });
      }

      const team = await TeamService.getTeamById(req.user.teamId);

      res.json({
        success: true,
        data: team
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamController();
