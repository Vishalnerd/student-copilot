import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../app";

import User from "../../models/user";
import Note from "../../models/note";
import Chat from "../../models/Chat";
import Flashcard from "../../models/Flashcard";
import Quiz from "../../models/Quiz";

describe("Dashboard API", () => {

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

        email: "dashboard@test.com",

        password,

      });

    userId =
      user._id.toString();

    const login =
      await request(app)

        .post("/api/auth/login")

        .send({

          email: "dashboard@test.com",

          password: "Password123",

        });

    cookies =
      login.headers["set-cookie"];

  });

  afterEach(() => {

    jest.clearAllMocks();

  });

  it("should return empty dashboard", async () => {

    const response =
      await request(app)

        .get("/api/dashboard")

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.totalNotes)
      .toBe(0);

    expect(response.body.totalQuestions)
      .toBe(0);

    expect(response.body.totalFlashcards)
      .toBe(0);

    expect(response.body.totalQuizzes)
      .toBe(0);

    expect(response.body.recentNotes)
      .toHaveLength(0);

  });

  it("should return dashboard statistics", async () => {

    const note1 =
      await Note.create({

        userId,

        fileName: "Java.pdf",

        filePath: "/tmp/java.pdf",

        content: "Java",

      });

    const note2 =
      await Note.create({

        userId,

        fileName: "Node.pdf",

        filePath: "/tmp/node.pdf",

        content: "Node",

      });

    await Chat.create({

      userId,

      noteId: note1._id,

      question: "Q1",

      answer: "A1",

    });

    await Chat.create({

      userId,

      noteId: note2._id,

      question: "Q2",

      answer: "A2",

    });

    await Flashcard.create({

      userId,

      noteId: note1._id,

      question: "F1",

      answer: "A1",

    });

    await Flashcard.create({

      userId,

      noteId: note2._id,

      question: "F2",

      answer: "A2",

    });

    await Quiz.create({

      userId,

      noteId: note1._id,

      question: "Quiz",

      options: ["A", "B", "C", "D"],

      correctAnswer: "A",

    });

    const response =
      await request(app)

        .get("/api/dashboard")

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.totalNotes)
      .toBe(2);

    expect(response.body.totalQuestions)
      .toBe(2);

    expect(response.body.totalFlashcards)
      .toBe(2);

    expect(response.body.totalQuizzes)
      .toBe(1);

    expect(response.body.recentNotes)
      .toHaveLength(2);

  });

  it("should only return current user's data", async () => {

    const password =
      await bcrypt.hash(
        "Password123",
        10
      );

    const otherUser =
      await User.create({

        name: "Other",

        email: "other@test.com",

        password,

      });

    await Note.create({

      userId: otherUser._id,

      fileName: "Other.pdf",

      filePath: "/tmp/other.pdf",

      content: "Other",

    });

    const response =
      await request(app)

        .get("/api/dashboard")

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(200);

    expect(response.body.totalNotes)
      .toBe(0);

  });

  it("should reject unauthorized request", async () => {

    const response =
      await request(app)

        .get("/api/dashboard");

    expect(response.status)
      .toBe(401);

  });

});