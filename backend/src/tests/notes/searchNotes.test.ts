import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../server";

import User from "../../models/user";
import Note from "../../models/note";

describe("Search Notes API", () => {

  let cookies: string;
  let userId: string;

  beforeEach(async () => {

    const password =
      await bcrypt.hash(
        "Password123",
        10
      );

    const user =
      await User.create({

        name: "Vishal",

        email: "search@test.com",

        password,

      });

    userId =
      user._id.toString();

    const login =
      await request(app)

        .post("/api/auth/login")

        .send({

          email: "search@test.com",

          password: "Password123",

        });

    cookies =
      login.headers["set-cookie"];

  });

  it("should search notes", async () => {

    await Note.create({

      userId,

      fileName: "Java Notes.pdf",

      filePath: "/tmp/java.pdf",

      content: "Java",

    });

    await Note.create({

      userId,

      fileName: "Node Notes.pdf",

      filePath: "/tmp/node.pdf",

      content: "Node",

    });

    const response =
      await request(app)

        .get("/api/notes/search?q=Java")

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.length)
      .toBe(1);

    expect(response.body[0].fileName)
      .toContain("Java");

  });

  it("should return empty array", async () => {

    const response =
      await request(app)

        .get("/api/notes/search?q=Python")

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(200);

    expect(response.body)
      .toHaveLength(0);

  });

  it("should isolate users", async () => {

    const password =
      await bcrypt.hash(
        "Password123",
        10
      );

    const other =
      await User.create({

        name: "Other",

        email: "other@test.com",

        password,

      });

    await Note.create({

      userId: other._id,

      fileName: "Java Secret.pdf",

      filePath: "/tmp/x.pdf",

      content: "Secret",

    });

    const response =
      await request(app)

        .get("/api/notes/search?q=Java")

        .set(
          "Cookie",
          cookies
        );

    expect(response.body)
      .toHaveLength(0);

  });

  it("should reject unauthorized", async () => {

    const response =
      await request(app)

        .get("/api/notes/search?q=Java");

    expect(response.status)
      .toBe(401);

  });

});