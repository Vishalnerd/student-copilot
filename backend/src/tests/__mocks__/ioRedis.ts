// src/tests/__mocks__/ioredis.ts
const mockRedisInstance = {
  on: jest.fn(),
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue("OK"),
  del: jest.fn().mockResolvedValue(1),
  quit: jest.fn().mockResolvedValue("OK"),
  disconnect: jest.fn().mockResolvedValue(true),
  publish: jest.fn().mockResolvedValue(1),
  subscribe: jest.fn().mockResolvedValue(1),
};

const RedisMock = jest.fn().mockImplementation(() => mockRedisInstance);

export default RedisMock;