import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../server";
import User from "../../models/user";

describe("Register API", () => {
  it("should register and automatically authenticate a local user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vishal",
        email: "v@test.com",
        password: "Password123",
      });

    expect(response.status).toBe(201);

    expect(response.body.user).toMatchObject({
      name: "Vishal",
      email: "v@test.com",
    });

    const cookies = response.headers["set-cookie"];

    expect(cookies).toBeDefined();

    const cookieList = Array.isArray(cookies)
      ? cookies
      : [cookies];

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

    const user = await User.findOne({
      email: "v@test.com",
    });

    expect(user).not.toBeNull();

    expect(user!.provider).toBe("local");

    expect(user!.googleId).toBeUndefined();

    expect(user!.refreshTokens.length).toBeGreaterThan(0);

    expect(user!.refreshTokens[0]).toMatch(/^\$2[aby]\$/);
  });

  it("should hash password before saving", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vishal",
        email: "v@test.com",
        password: "Password123",
      });

    const user = await User.findOne({
      email: "v@test.com",
    });

    expect(user).not.toBeNull();

    expect(user!.password).not.toBe("Password123");

    const match = await bcrypt.compare(
      "Password123",
      user!.password!
    );

    expect(match).toBe(true);
  });

  it("should normalize email to lowercase", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vishal",
        email: "V@TEST.COM",
        password: "Password123",
      });

    const user = await User.findOne({
      email: "v@test.com",
    });

    expect(user).not.toBeNull();
  });

  it("should reject duplicate email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vishal",
        email: "v@test.com",
        password: "Password123",
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Another User",
        email: "v@test.com",
        password: "Password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toContain(
      "User already exists"
    );
  });

  it("should reject invalid email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vishal",
        email: "abc",
        password: "Password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });

  it("should reject short password", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vishal",
        email: "v@test.com",
        password: "123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });

  it("should reject missing name", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        email: "v@test.com",
        password: "Password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });

  it("should reject missing email", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vishal",
        password: "Password123",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });

  it("should reject missing password", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vishal",
        email: "v@test.com",
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Validation failed"
    );
  });

  it("should create a local provider account", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Vishal",
        email: "v@test.com",
        password: "Password123",
      });

    const user = await User.findOne({
      email: "v@test.com",
    });

    expect(user).not.toBeNull();

    expect(user!.provider).toBe("local");

    expect(user!.googleId).toBeUndefined();
  });
});