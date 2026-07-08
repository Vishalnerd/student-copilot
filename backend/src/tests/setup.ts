// 1. 💡 CRITICAL: Place the mocks at the absolute top before ANY other project files load!
jest.mock("bullmq", () => {
  return {
    Queue: jest.fn().mockImplementation(() => {
      return {
        add: jest.fn().mockResolvedValue({ id: "global-mock-job-id" }),
        on: jest.fn(),
      };
    }),
    Worker: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn(),
      };
    }),
  };
});

jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => {
    return {
      on: jest.fn(),
      options: { keyPrefix: "" }, // ⚡ Bypasses the keyPrefix TypeErrors safely
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue("OK"),
      quit: jest.fn().mockResolvedValue("OK"),
    };
  });
});

// 2. Now load your standard environment packages and local project imports safely
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user";
import dotenv from "dotenv";
import { redis } from "../config/redis";

dotenv.config({ path: ".env" });

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  // Force Mongoose to create the collection and sync indexes
  await User.syncIndexes();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
  if (redis && typeof redis.quit === "function") {
    await redis.quit();
  }
});