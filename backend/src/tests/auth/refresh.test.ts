import request from "supertest";
import app from "../../server";
import { createUser } from "../helpers/createUser";

describe("Refresh Token", () => {

  it("should issue a new access token", async () => {

    await createUser();

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "vishal@test.com",
        password: "Password123",
      });

    const cookies = login.headers["set-cookie"];

    const response = await request(app)
      .post("/api/auth/refresh-token")
      .set("Cookie", cookies);

    expect(response.status).toBe(200);

    expect(response.headers["set-cookie"]).toBeDefined();

    expect(response.body.message)
      .toBe("Token refreshed successfully");

  });

  it("should reject when refresh token is missing", async () => {

    const response = await request(app)
    .post("/api/auth/refresh-token");

    expect(response.status).toBe(401);

});

it("should reject invalid refresh token", async () => {

    const response = await request(app)

    .post("/api/auth/refresh-token")

    .set("Cookie", [
      "refreshToken=invalid-token"
    ]);

    expect(response.status).toBe(401);

});

});