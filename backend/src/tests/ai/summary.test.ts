import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../server";

import User from "../../models/user";
import Note from "../../models/note";

import {
  generateSummaryService,
} from "../../services/prompts/summaryService";

jest.mock("../../services/prompts/summaryService", () => ({
  generateSummaryService: jest.fn(),
}));

const mockedSummary =
  generateSummaryService as jest.Mock;

describe("Summary API", () => {

  let cookies: string;

  let noteId: string;

  let userId: string;

  beforeEach(async () => {

    mockedSummary.mockResolvedValue(
      "Java is a high-level programming language."
    );

    const password =
      await bcrypt.hash(
        "Password123",
        10
      );

    const user =
      await User.create({

        name: "Vishal",

        email: "v@test.com",

        password,

      });

    userId =
      user._id.toString();

    const login =
      await request(app)

        .post("/api/auth/login")

        .send({

          email: "v@test.com",

          password: "Password123",

        });

    cookies =
      login.headers["set-cookie"];

    const note =
      await Note.create({

        userId,

        fileName: "java.pdf",

        filePath: "/tmp/java.pdf",

        content:
          "Java is an object oriented programming language.",

      });

    noteId =
      note._id.toString();

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate summary", async () => {

    const response =
      await request(app)

        .post(`/api/ai/${noteId}/summary`)

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.summary)
      .toBe(
        "Java is a high-level programming language."
      );

    expect(response.body.cached)
      .toBe(false);

    expect(mockedSummary)
      .toHaveBeenCalledTimes(1);

  });

  it("should save summary in database", async () => {

    await request(app)

      .post(`/api/ai/${noteId}/summary`)

      .set(
        "Cookie",
        cookies
      );

    const updated =
      await Note.findById(
        noteId
      );

    expect(updated?.summary)
      .toBe(
        "Java is a high-level programming language."
      );

  });

  it("should return cached summary", async () => {

    await request(app)

      .post(`/api/ai/${noteId}/summary`)

      .set(
        "Cookie",
        cookies
      );

    mockedSummary.mockClear();

    const response =
      await request(app)

        .post(`/api/ai/${noteId}/summary`)

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.cached)
      .toBe(true);

    expect(mockedSummary)
      .not.toHaveBeenCalled();

  });

  it("should return 404 when note does not exist", async () => {

    const response =
      await request(app)

        .post(
          "/api/ai/685555555555555555555555/summary"
        )

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(404);

  });

  it("should reject unauthorized request", async () => {

    const response =
      await request(app)

        .post(`/api/ai/${noteId}/summary`);

    expect(response.status)
      .toBe(401);

  });

});