process.env.SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || 'test-access-token';
process.env.SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'test';
process.env.PORT = process.env.PORT || '4000';

// Increase timeout for integration tests
jest.setTimeout(10000);
