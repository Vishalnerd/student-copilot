import request from "supertest";
import app from "../../server";
import User from "../../models/user";

describe("Register", () => {

    it("should register user", async () => {

        const response = await request(app)

            .post("/api/auth/register")

            .send({

                name: "Vishal",

                email: "v@test.com",

                password: "Password123"

            });

        expect(response.status).toBe(201);

        expect(response.body.user.email)

            .toBe("v@test.com");

        const user = await User.findOne({

            email: "v@test.com"

        });

        expect(user).not.toBeNull();

    });

    it("should reject duplicate email", async () => {

    await request(app)

        .post("/api/auth/register")

        .send({

            name: "Vishal",

            email: "v@test.com",

            password: "Password123"

        });

    const response = await request(app)

        .post("/api/auth/register")

        .send({

            name: "Another",

            email: "v@test.com",

            password: "Password123"

        });

    expect(response.status).toBe(400);

});

it("should reject invalid email", async () => {

    const response = await request(app)

        .post("/api/auth/register")

        .send({

            name: "Vishal",

            email: "abc",

            password: "Password123"

        });

    expect(response.status)

        .toBe(400);

});

});