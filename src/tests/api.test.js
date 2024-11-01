import request from 'supertest';
import { app } from '../server.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let authToken;
let testUser;

beforeAll(async () => {
  // Create test user
  testUser = await User.create({
    email: 'test@example.com',
    password: 'password123',
    scrollSettings: {
      dynamicResistance: {
        isEnabled: true,
        resistanceLevel: 5
      }
    }
  });

  authToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Scroll Settings API', () => {
  test('Update scroll settings', async () => {
    const response = await request(app)
      .post('/api/scroll/settings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        dynamicResistance: {
          resistanceLevel: 7
        }
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.scrollSettings.dynamicResistance.resistanceLevel).toBe(7);
  });

  test('Get scroll resistance', async () => {
    const response = await request(app)
      .get('/api/scroll/resistance')
      .set('Authorization', `Bearer ${authToken}`)
      .query({
        timestamp: new Date().toISOString()
      });

    expect(response.status).toBe(200);
    expect(response.body.resistance).toBeDefined();
    expect(response.body.isEnabled).toBeDefined();
  });
});

describe('Focus Mode API', () => {
  test('Update focus mode settings', async () => {
    const response = await request(app)
      .post('/api/focus/settings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        blockedApps: [{
          appName: 'Facebook',
          isBlocked: true
        }]
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.focusMode.blockedApps).toHaveLength(1);
  });

  test('Check app block status', async () => {
    const response = await request(app)
      .get('/api/focus/check-app')
      .set('Authorization', `Bearer ${authToken}`)
      .query({
        appName: 'Facebook'
      });

    expect(response.status).toBe(200);
    expect(response.body.blocked).toBeDefined();
  });
});