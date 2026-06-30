import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../server";

import User from "../../models/user";
import Note from "../../models/note";
import Quiz from "../../models/Quiz";

import {
  generateQuizService,
} from "../../services/prompts/quizService";

jest.mock("../../services/prompts/quizService", () => ({
  generateQuizService: jest.fn(),
}));

const mockedQuiz =
  generateQuizService as jest.Mock;

describe("Quiz API", () => {

  let cookies: string;
  let noteId: string;
  let userId: string;

  beforeEach(async () => {

    mockedQuiz.mockResolvedValue(
      JSON.stringify([
        {
          question: "What is Java?",
          options: [
            "Language",
            "OS",
            "Browser",
            "Database"
          ],
          correctAnswer: "Language",
        },
        {
          question: "Who created Java?",
          options: [
            "James Gosling",
            "Dennis Ritchie",
            "Bjarne",
            "Guido"
          ],
          correctAnswer: "James Gosling",
        },
      ])
    );

    const password =
      await bcrypt.hash(
        "Password123",
        10
      );

    const user =
      await User.create({
        name: "Vishal",
        email: "quiz@test.com",
        password,
      });

    userId =
      user._id.toString();

    const login =
      await request(app)
        .post("/api/auth/login")
        .send({
          email: "quiz@test.com",
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

  it("should generate quiz", async () => {

    const response =
      await request(app)
        .post(`/api/ai/${noteId}/quiz`)
        .set("Cookie", cookies);

    expect(response.status).toBe(201);

    expect(response.body.cached).toBe(false);

    expect(response.body.quizzes).toHaveLength(2);

    expect(mockedQuiz)
      .toHaveBeenCalledTimes(1);

  });

  it("should save quiz", async () => {

    await request(app)
      .post(`/api/ai/${noteId}/quiz`)
      .set("Cookie", cookies);

    const quizzes =
      await Quiz.find({
        noteId,
      });

    expect(quizzes.length)
      .toBe(2);

  });

  it("should return cached quiz", async () => {

    await request(app)
      .post(`/api/ai/${noteId}/quiz`)
      .set("Cookie", cookies);

    mockedQuiz.mockClear();

    const response =
      await request(app)
        .post(`/api/ai/${noteId}/quiz`)
        .set("Cookie", cookies);

    expect(response.status)
      .toBe(200);

    expect(response.body.cached)
      .toBe(true);

    expect(mockedQuiz)
      .not.toHaveBeenCalled();

  });

  it("should get quizzes", async () => {

    await request(app)
      .post(`/api/ai/${noteId}/quiz`)
      .set("Cookie", cookies);

    const response =
      await request(app)
        .get("/api/ai/quizzes")
        .set("Cookie", cookies);

    expect(response.status)
      .toBe(200);

    expect(response.body.length)
      .toBe(2);

  });

  it("should return 404 if note not found", async () => {

    const response =
      await request(app)
        .post("/api/ai/685555555555555555555555/quiz")
        .set("Cookie", cookies);

    expect(response.status)
      .toBe(404);

  });

  it("should reject unauthorized request", async () => {

    const response =
      await request(app)
        .post(`/api/ai/${noteId}/quiz`);

    expect(response.status)
      .toBe(401);

  });

  it("should handle invalid AI JSON", async () => {

    const spy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockedQuiz.mockResolvedValue(
      "INVALID JSON"
    );

    const response =
      await request(app)
        .post(`/api/ai/${noteId}/quiz`)
        .set("Cookie", cookies);

    expect(response.status)
      .toBe(500);

    expect(response.body.message)
      .toBe(
        "Failed to parse AI response structures"
      );

    spy.mockRestore();

  });

});