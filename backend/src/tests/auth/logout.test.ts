import request from "supertest";
import app from "../../app";
import { createUser } from "../helpers/createUser";

describe("Logout", () => {

  it("should logout successfully", async () => {

    await createUser();

    const login = await request(app)

      .post("/api/auth/login")

      .send({

        email: "vishal@test.com",

        password: "Password123"

      });

    const cookies =
      login.headers["set-cookie"];

    const response = await request(app)

      .post("/api/auth/logout")

      .set("Cookie", cookies);

    expect(response.status)

      .toBe(200);

    expect(response.body.message)

      .toBe("Logged out successfully");

  });

  it("should reject profile after logout", async () => {

  await createUser();

  const login = await request(app)

    .post("/api/auth/login")

    .send({

      email: "vishal@test.com",

      password: "Password123"

    });

  const cookies =
    login.headers["set-cookie"];

  await request(app)

    .post("/api/auth/logout")

    .set("Cookie", cookies);

  const refresh = await request(app)

.post("/api/auth/refresh-token")

.set("Cookie", cookies);

expect(refresh.status).toBe(401);

});

});