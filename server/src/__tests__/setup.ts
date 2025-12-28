// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key-for-testing-purposes';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buvette-ehtp-test';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

