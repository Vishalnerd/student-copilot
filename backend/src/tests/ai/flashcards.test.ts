import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../app";

import User from "../../models/user";
import Note from "../../models/note";
import Flashcard from "../../models/Flashcard";

import {
  generateFlashcardService,
} from "../../services/prompts/FlashcardService";

jest.mock("../../services/prompts/FlashcardService", () => ({
  generateFlashcardService: jest.fn(),
}));

const mockedFlashcards =
  generateFlashcardService as jest.Mock;

describe("Flashcard API", () => {

  let cookies: string;

  let noteId: string;

  let userId: string;

  beforeEach(async () => {

    mockedFlashcards.mockResolvedValue([
  {
    question: "What is Java?",
    answer: "A programming language",
  },
  {
    question: "Who created Java?",
    answer: "James Gosling",
  },
]);

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

        fileUrl: "/tmp/java.pdf",

        cloudinaryId: "java-id",

        content:
          "Java is an object oriented programming language.",

      });

    noteId =
      note._id.toString();

  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it("should generate flashcards", async () => {

    const response =
      await request(app)

        .post(`/api/ai/${noteId}/flashcards`)

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(201);

    expect(response.body.cached)
      .toBe(false);

    expect(response.body.flashcards)
      .toHaveLength(2);

    expect(mockedFlashcards)
      .toHaveBeenCalledTimes(1);

  });

  it("should save flashcards", async () => {

    await request(app)

      .post(`/api/ai/${noteId}/flashcards`)

      .set(
        "Cookie",
        cookies
      );

    const cards =
      await Flashcard.find({
        noteId,
      });

    expect(cards.length)
      .toBe(2);

  });

  it("should return cached flashcards", async () => {

    await request(app)

      .post(`/api/ai/${noteId}/flashcards`)

      .set(
        "Cookie",
        cookies
      );

    mockedFlashcards.mockClear();

    const response =
      await request(app)

        .post(`/api/ai/${noteId}/flashcards`)

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.cached)
      .toBe(true);

    expect(mockedFlashcards)
      .not.toHaveBeenCalled();

  });

  it("should get all flashcards", async () => {

    await request(app)

      .post(`/api/ai/${noteId}/flashcards`)

      .set(
        "Cookie",
        cookies
      );

    const response =
      await request(app)

        .get("/api/ai/flashcards")

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.length)
      .toBe(2);

  });

  it("should return 404 if note not found", async () => {

    const response =
      await request(app)

        .post(
          "/api/ai/685555555555555555555555/flashcards"
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

        .post(`/api/ai/${noteId}/flashcards`);

    expect(response.status)
      .toBe(401);

  });

  it("should handle invalid AI JSON", async () => {

    mockedFlashcards.mockRejectedValue(
  new Error("Invalid JSON")
);

    const response =
      await request(app)

        .post(`/api/ai/${noteId}/flashcards`)

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(500);

    expect(response.body.message)
      .toBe(
        "Server Error"
      );

  });

});