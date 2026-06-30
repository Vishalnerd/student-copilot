import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../server";

import User from "../../models/user";
import Note from "../../models/note";
import NoteChunk from "../../models/NoteChunk";
import Chat from "../../models/Chat";

import {
  generateAIResponse,
} from "../../services/ai/geminiService";

import {
  generateEmbedding,
} from "../../services/ai/embeddingService";

jest.mock("../../services/ai/geminiService", () => ({
  generateAIResponse: jest.fn(),
}));

jest.mock("../../services/ai/embeddingService", () => ({
  generateEmbedding: jest.fn(),
}));

const mockedAI =
  generateAIResponse as jest.Mock;

const mockedEmbedding =
  generateEmbedding as jest.Mock;

describe("Ask Question API", () => {

  let cookies: string;

  let userId: string;

  let noteId: string;

  beforeEach(async () => {

    mockedEmbedding.mockResolvedValue([1, 2, 3]);

    mockedAI.mockResolvedValue(
      "Java is an object-oriented programming language."
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

    cookies=login.headers["set-cookie"];

    const note =
      await Note.create({

        userId,

        fileName: "java.pdf",

        filePath: "/uploads/java.pdf",

        content:
          "Java is an object oriented programming language.",

      });

    noteId =
      note._id.toString();

    await NoteChunk.create({

      noteId,

      userId,

      chunkIndex: 0,

      content:
        "Java is object oriented.",

      embedding:
        [1, 2, 3],

    });

  });

  it("should answer a question", async () => {

    const response =
      await request(app)

        .post(`/api/notes/${noteId}/ask`)

        .set(
          "Cookie",
          cookies
        )

        .send({

          question:
            "What is Java?",

        });

    expect(response.status)
      .toBe(200);

    expect(response.body.answer)
      .toBe(
        "Java is an object-oriented programming language."
      );

    expect(mockedEmbedding)
      .toHaveBeenCalledTimes(1);

    expect(mockedAI)
      .toHaveBeenCalledTimes(1);

  });

  it("should save chat history", async () => {

    await request(app)

      .post(`/api/notes/${noteId}/ask`)

      .set(
        "Cookie",
        cookies
      )

      .send({

        question:
          "Explain Java",

      });

    const chat =
      await Chat.findOne({

        noteId,

      });

    expect(chat)
      .not.toBeNull();

    expect(chat?.question)
      .toBe(
        "Explain Java"
      );

    expect(chat?.answer)
      .toBe(
        "Java is an object-oriented programming language."
      );

  });

  it("should reject empty question", async () => {

    const response =
      await request(app)

        .post(`/api/notes/${noteId}/ask`)

        .set(
          "Cookie",
          cookies
        )

        .send({});

    expect(response.status)
      .toBe(400);

  });

  it("should return 404 when note does not exist", async () => {

    const response =
      await request(app)

        .post(
          "/api/notes/685555555555555555555555/ask"
        )

        .set(
          "Cookie",
          cookies
        )

        .send({

          question:
            "Hello",

        });

    expect(response.status)
      .toBe(404);

  });

  it("should return 404 when no chunks exist", async () => {

    await NoteChunk.deleteMany({});

    const response =
      await request(app)

        .post(`/api/notes/${noteId}/ask`)

        .set(
          "Cookie",
          cookies
        )

        .send({

          question:
            "What is Java?",

        });

    expect(response.status)
      .toBe(404);

  });

});