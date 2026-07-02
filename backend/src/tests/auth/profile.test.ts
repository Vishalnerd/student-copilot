import request from "supertest";
import app from "../../app";
import { createUser } from "../helpers/createUser";

describe("Profile", () => {

    it("should get profile", async () => {

        await createUser();

        const login = await request(app)

            .post("/api/auth/login")

            .send({

                email: "vishal@test.com",

                password: "Password123"

            });

        const cookies = login.headers["set-cookie"];

        const response = await request(app)

            .get("/api/auth/profile")

            .set("Cookie", cookies);

        expect(response.status)

            .toBe(200);

    });

});