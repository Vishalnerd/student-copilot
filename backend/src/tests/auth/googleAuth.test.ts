import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../app";
import User from "../../models/user";
import { verifyIdTokenMock } from "../__mocks__/google-auth-library";

jest.mock("google-auth-library");

describe("Google OAuth", () => {
  const googlePayload = {
    sub: "google-user-id",
    email: "google@test.com",
    name: "Google User",
    picture: "https://avatar.test/avatar.png",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => googlePayload,
    });
  });

  it("should create a new Google user", async () => {
    const response = await request(app)
      .post("/api/auth/google")
      .send({
        credential: "fake-google-token",
      });

    expect(response.status).toBe(200);

    expect(response.body.user.email).toBe("google@test.com");

    const user = await User.findOne({
      email: "google@test.com",
    });

    expect(user).not.toBeNull();
    expect(user!.provider).toBe("google");
    expect(user!.googleId).toBe("google-user-id");
    expect(user!.avatar).toBe(
      "https://avatar.test/avatar.png"
    );
  });

  it("should login an existing Google user", async () => {
    await User.create({
      name: "Google User",
      email: "google@test.com",
      googleId: "google-user-id",
      provider: "google",
      avatar: "old-avatar",
    });

    const response = await request(app)
      .post("/api/auth/google")
      .send({
        credential: "fake-google-token",
      });

    expect(response.status).toBe(200);

    const user = await User.findOne({
      email: "google@test.com",
    });

    expect(user).not.toBeNull();
    expect(user!.provider).toBe("google");
    expect(user!.googleId).toBe("google-user-id");

    // Avatar should be updated
    expect(user!.avatar).toBe(
      "https://avatar.test/avatar.png"
    );
  });

  it("should link an existing local account", async () => {
    const password = await bcrypt.hash(
      "Password123",
      10
    );

    await User.create({
      name: "Vishal",
      email: "google@test.com",
      password,
      provider: "local",
    });

    const response = await request(app)
      .post("/api/auth/google")
      .send({
        credential: "fake-google-token",
      });

    expect(response.status).toBe(200);

    const user = await User.findOne({
      email: "google@test.com",
    });

    expect(user).not.toBeNull();

    expect(user!.provider).toBe("google");
    expect(user!.googleId).toBe("google-user-id");
  });

  it("should reject missing credential", async () => {
    const response = await request(app)
      .post("/api/auth/google")
      .send({});

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Google credential is required"
    );
  });

  it("should reject invalid Google token", async () => {
    verifyIdTokenMock.mockRejectedValue(
      new Error("Invalid token")
    );

    const response = await request(app)
      .post("/api/auth/google")
      .send({
        credential: "bad-token",
      });

    expect(response.status).toBe(500);

    expect(response.body.message).toBe(
      "Google authentication failed"
    );
  });

  it("should reject payload with no email", async () => {
    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => ({
        sub: "abc",
        name: "Google User",
        picture: "avatar",
      }),
    });

    const response = await request(app)
      .post("/api/auth/google")
      .send({
        credential: "fake-token",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Google account has no email"
    );
  });

  it("should reject null payload", async () => {
    verifyIdTokenMock.mockResolvedValue({
      getPayload: () => null,
    });

    const response = await request(app)
      .post("/api/auth/google")
      .send({
        credential: "fake-token",
      });

    expect(response.status).toBe(401);

    expect(response.body.message).toBe(
      "Invalid Google token"
    );
  });

  it("should issue access and refresh cookies", async () => {
    const response = await request(app)
      .post("/api/auth/google")
      .send({
        credential: "fake-google-token",
      });

    const cookies = response.headers["set-cookie"];

    expect(cookies).toBeDefined();

    const cookieList = Array.isArray(cookies)
      ? cookies
      : [cookies];

    expect(
      cookieList.some((cookie) =>
        cookie.startsWith("accessToken")
      )
    ).toBe(true);

    expect(
      cookieList.some((cookie) =>
        cookie.startsWith("refreshToken")
      )
    ).toBe(true);
  });

  it("should hash refresh token before storing", async () => {
    await request(app)
      .post("/api/auth/google")
      .send({
        credential: "fake-google-token",
      });

    const user = await User.findOne({
      email: "google@test.com",
    });

    expect(user).not.toBeNull();

    expect(user!.refreshTokens.length)
      .toBeGreaterThan(0);

    expect(user!.refreshTokens[0]).toMatch(
      /^\$2[aby]\$/
    );
  });
});