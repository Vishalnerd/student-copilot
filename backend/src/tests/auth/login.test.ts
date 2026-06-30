import request from "supertest";
import app from "../../server";
import { createUser } from "../helpers/createUser";
import User from "../../models/user";
import bcrypt from "bcryptjs";

describe("Login", () => {

    it("should login user", async () => {

        await createUser();

        const response = await request(app)

            .post("/api/auth/login")

            .send({

                email: "vishal@test.com",

                password: "Password123"

            });

        expect(response.status)

            .toBe(200);

        expect(response.headers["set-cookie"])

            .toBeDefined();

    });

    it("should reject wrong password", async () => {

    await createUser();

    const response = await request(app)

        .post("/api/auth/login")

        .send({

            email: "vishal@test.com",

            password: "WrongPassword"

        });

    expect(response.status)

        .toBe(400);

    });
    

    it("should hash password", async () => {

  await createUser();

  const user =
    await User.findOne({

      email:"vishal@test.com"

    });

  expect(user).not.toBeNull();

  const match =
    await bcrypt.compare(

      "Password123",

      user!.password

    );

  expect(match)

    .toBe(true);

    });

    it("should hash refresh token", async () => {

  await createUser();

  const login =
    await request(app)

      .post("/api/auth/login")

      .send({

        email:"vishal@test.com",

        password:"Password123"

      });

  const user =
    await User.findOne({

      email:"vishal@test.com"

    });

  expect(

    user!.refreshTokens.length

  ).toBeGreaterThan(0);

  expect(

    user!.refreshTokens[0]

  ).not.toContain("ey");

    });
});