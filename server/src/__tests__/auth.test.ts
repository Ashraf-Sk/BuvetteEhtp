import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/User';
import { connectDatabase } from '../config/database';

describe('Auth API - Login', () => {
  let testUser: any;

  beforeAll(async () => {
    // Connect to test database
    try {
      await connectDatabase();
    } catch (error) {
      console.error('Database connection error:', error);
    }
    
    // Clean up any existing test users
    await User.deleteMany({ 
      $or: [
        { email: 'test@ehtp.ac.ma' },
        { studentId: 'EHTP-1234' },
        { email: 'unverified@ehtp.ac.ma' },
        { studentId: 'EHTP-5678' }
      ]
    });
    
    // Create a test user
    testUser = await User.create({
      fullName: 'Test User',
      email: 'test@ehtp.ac.ma',
      studentId: 'EHTP-1234',
      password: 'Test1234!',
      role: 'student',
      isVerified: true,
      preferredLanguage: 'fr',
    });
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ 
      $or: [
        { email: 'test@ehtp.ac.ma' },
        { studentId: 'EHTP-1234' },
        { email: 'unverified@ehtp.ac.ma' },
        { studentId: 'EHTP-5678' }
      ]
    });
    
    // Close database connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          studentId: 'EHTP-1234',
          password: 'Test1234!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user).toHaveProperty('fullName', 'Test User');
      expect(response.body.data.user).toHaveProperty('email', 'test@ehtp.ac.ma');
      expect(response.body.data.user).toHaveProperty('studentId', 'EHTP-1234');
      expect(response.body.data.user).toHaveProperty('role', 'student');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should login with case-insensitive studentId', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          studentId: 'ehtp-1234', // lowercase
          password: 'Test1234!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
    });

    it('should return 401 for invalid studentId', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          studentId: 'EHTP-9999',
          password: 'Test1234!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          studentId: 'EHTP-1234',
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for unverified user', async () => {
      // Create an unverified user
      const unverifiedUser = await User.create({
        fullName: 'Unverified User',
        email: 'unverified@ehtp.ac.ma',
        studentId: 'EHTP-5678',
        password: 'Test1234!',
        role: 'student',
        isVerified: false,
        preferredLanguage: 'fr',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          studentId: 'EHTP-5678',
          password: 'Test1234!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Please verify your email first');

      // Clean up
      await User.deleteOne({ _id: unverifiedUser._id });
    });

    it('should return 400 for missing studentId', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Test1234!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          studentId: 'EHTP-1234',
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for empty studentId', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          studentId: '',
          password: 'Test1234!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for empty password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          studentId: 'EHTP-1234',
          password: '',
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should update lastLogin timestamp on successful login', async () => {
      const userBefore = await User.findById(testUser._id);
      const lastLoginBefore = userBefore?.lastLogin;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await request(app)
        .post('/api/auth/login')
        .send({
          studentId: 'EHTP-1234',
          password: 'Test1234!',
        })
        .expect(200);

      const userAfter = await User.findById(testUser._id);
      expect(userAfter?.lastLogin).toBeDefined();
      if (lastLoginBefore) {
        expect(userAfter?.lastLogin?.getTime()).toBeGreaterThan(lastLoginBefore.getTime());
      }
    });

    it('should return a valid JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          studentId: 'EHTP-1234',
          password: 'Test1234!',
        })
        .expect(200);

      const token = response.body.data.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);

      // Token should be usable for authenticated requests
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(meResponse.body.data.user).toHaveProperty('email', 'test@ehtp.ac.ma');
    });
  });
});

