import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../app";
import User from "../../models/user";
import { createUser } from "../helpers/createUser";

describe("Login API", () => {
  it("should login a valid user", async () => {
    await createUser();

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "vishal@test.com",
        password: "Password123",
      });

    expect(response.status).toBe(200);

    expect(response.headers["set-cookie"]).toBeDefined();

    expect(response.body.user).toMatchObject({
      email: "vishal@test.com",
    });
  });

  it("should login regardless of email case", async () => {
    await createUser();

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "VISHAL@Test.com",
        password: "Password123",
      });

    expect(response.status).toBe(200);
  });

  it("should reject wrong password", async () => {
    await createUser();

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "vishal@test.com",
        password: "WrongPassword",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should reject unknown user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "unknown@test.com",
        password: "Password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should reject missing email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        password: "Password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe("Validation failed");
  });

  it("should reject missing password", async () => {
    await createUser();

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "vishal@test.com",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe("Validation failed");
  });

  it("should reject password login for Google account", async () => {
    await User.create({
      name: "Google User",
      email: "google@test.com",
      googleId: "google-user-id",
      provider: "google",
      refreshTokens: [],
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "google@test.com",
        password: "Password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "This account uses Google Sign-In. Please continue with Google."
    );
  });

  it("should store password as bcrypt hash", async () => {
    await createUser();

    const user = await User.findOne({
      email: "vishal@test.com",
    });

    expect(user).not.toBeNull();

    const match = await bcrypt.compare(
      "Password123",
      user!.password!
    );

    expect(match).toBe(true);
  });

  it("should store refresh token as bcrypt hash", async () => {
    await createUser();

    await request(app)
      .post("/api/auth/login")
      .send({
        email: "vishal@test.com",
        password: "Password123",
      });

    const user = await User.findOne({
      email: "vishal@test.com",
    });

    expect(user).not.toBeNull();

    expect(user!.refreshTokens.length).toBeGreaterThan(0);

    expect(user!.refreshTokens[0]).toMatch(/^\$2[aby]\$/);
  });

  it("should issue access and refresh cookies", async () => {
    await createUser();

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "vishal@test.com",
        password: "Password123",
      });

    const cookies = response.headers["set-cookie"];

    expect(cookies).toBeDefined();

    const cookieList = Array.isArray(cookies) ? cookies : [cookies];

    expect(
      cookieList.some((cookie: string) =>
        cookie.startsWith("accessToken=")
      )
    ).toBe(true);

    expect(
      cookieList.some((cookie: string) =>
        cookie.startsWith("refreshToken=")
      )
    ).toBe(true);
  });
});