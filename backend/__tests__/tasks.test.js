const request = require('supertest');
const app = require('../src/server');
const { sequelize } = require('../src/database/connection');
const { User, Task, License } = require('../src/models');

describe('Task API', () => {
  let goonToken, hashiraToken, adminToken;
  let hashiraId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create test users
    const goon = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'goon',
        email: 'goon@test.com',
        password: 'Test123!',
        role: 'GOON'
      });

    const hashira = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'hashira',
        email: 'hashira@test.com',
        password: 'Test123!',
        role: 'HASHIRA'
      });

    hashiraId = hashira.body.data.id;

    const admin = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'admin',
        email: 'admin@test.com',
        password: 'Test123!',
        role: 'OYAKATASAMA'
      });

    // Login to get tokens
    const goonLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'goon', password: 'Test123!' });
    goonToken = goonLogin.body.data.token;

    const hashiraLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'hashira', password: 'Test123!' });
    hashiraToken = hashiraLogin.body.data.token;

    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: 'Test123!' });
    adminToken = adminLogin.body.data.token;

    // Create a license and assign to users
    const license = await License.create({
      teamName: 'Test Team',
      licenseKey: 'TEST-2024-LICENSE',
      isActive: true,
      maxUsers: 10
    });

    const users = await User.findAll();
    for (const user of users) {
      await user.addLicense(license);
    }
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/v1/tasks', () => {
    it('should allow Hashira to create task', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${hashiraToken}`)
        .send({
          title: 'Test Task',
          description: 'This is a test task description with enough characters',
          bountyAmount: 100.00,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'HIGH',
          tags: ['test', 'backend']
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Task');
    });

    it('should not allow Goon to create task', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${goonToken}`)
        .send({
          title: 'Test Task 2',
          description: 'This is a test task description with enough characters',
          bountyAmount: 100.00,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'HIGH'
        });

      expect(res.statusCode).toBe(403);
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${hashiraToken}`)
        .send({
          title: 'Test Task 3'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should get all tasks', async () => {
      const res = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${goonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter tasks by status', async () => {
      const res = await request(app)
        .get('/api/v1/tasks?status=AVAILABLE')
        .set('Authorization', `Bearer ${goonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.every(task => task.status === 'AVAILABLE')).toBe(true);
    });
  });

  describe('GET /api/v1/tasks/board', () => {
    it('should get kanban board', async () => {
      const res = await request(app)
        .get('/api/v1/tasks/board')
        .set('Authorization', `Bearer ${goonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('available');
      expect(res.body.data).toHaveProperty('inProgress');
      expect(res.body.data).toHaveProperty('review');
      expect(res.body.data).toHaveProperty('completed');
    });
  });

  describe('POST /api/v1/tasks/:id/assign', () => {
    let taskId;

    beforeAll(async () => {
      const task = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${hashiraToken}`)
        .send({
          title: 'Assignable Task',
          description: 'This task will be assigned to goon for testing purposes',
          bountyAmount: 150.00,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'MEDIUM'
        });

      taskId = task.body.data.id;
    });

    it('should allow Goon to assign task to themselves', async () => {
      const res = await request(app)
        .post(`/api/v1/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${goonToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('should not allow assigning already assigned task', async () => {
      const res = await request(app)
        .post(`/api/v1/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${goonToken}`);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('PUT /api/v1/tasks/:id/status', () => {
    let taskId;

    beforeAll(async () => {
      const task = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${hashiraToken}`)
        .send({
          title: 'Status Update Task',
          description: 'This task will be used to test status updates functionality',
          bountyAmount: 200.00,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'HIGH'
        });

      taskId = task.body.data.id;

      await request(app)
        .post(`/api/v1/tasks/${taskId}/assign`)
        .set('Authorization', `Bearer ${goonToken}`);
    });

    it('should allow assigned user to update status', async () => {
      const res = await request(app)
        .put(`/api/v1/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${goonToken}`)
        .send({
          status: 'REVIEW'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('REVIEW');
    });
  });
});
