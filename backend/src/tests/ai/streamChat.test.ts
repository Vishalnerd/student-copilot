import request from "supertest";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import app from "../../app";
import User from "../../models/user";
import Note from "../../models/note";
import Chat from "../../models/Chat";

import { buildRagPrompt } from "../../services/ai/ragService";
import { generateAIStream } from "../../services/ai/geminiService";

jest.mock("../../services/ai/ragService", () => ({
  buildRagPrompt: jest.fn(),
}));

jest.mock("../../services/ai/geminiService", () => ({
  generateAIStream: jest.fn(),
}));

const mockedRag = buildRagPrompt as jest.Mock;
const mockedAIStream = generateAIStream as jest.Mock;

describe("POST /api/notes/:id/stream - Real-time SSE Stream Engine Suite", () => {
  let cookies: string;
  let userId: string;
  let noteId: string;
  let noteDocument: any;

  beforeEach(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});
    await Chat.deleteMany({});
    jest.clearAllMocks();

    // 1. Create your user shell and set up authentic cookies session context
    const password = await bcrypt.hash("Password123", 10);
    const user = await User.create({
      name: "Vishal",
      email: "stream@test.com",
      password,
    });
    userId = user._id.toString();

    const login = await request(app)
      .post("/api/auth/login")
      .send({ email: "stream@test.com", password: "Password123" });

    cookies = login.headers["set-cookie"];

    // 2. Build your base source document model state
    noteDocument = await Note.create({
      userId,
      fileName: "sample.pdf",
      filePath: "/uploads/sample.pdf",
      status: "completed",
    });
    noteId = noteDocument._id.toString();

    // 3. Default successful mock parameters matching your controller expectations
    mockedRag.mockResolvedValue({
      prompt: "Synthesized AI Context Matrix",
      note: noteDocument,
    });
  });

  it("should stream message tokens down an active SSE connection using explicit event token tags", async () => {
    mockedAIStream.mockResolvedValue({
      async *[Symbol.asyncIterator]() {
        yield { text: "Functional " };
        yield { text: "Programming." };
      },
    });

    const response = await request(app)
      .post(`/api/notes/${noteId}/stream`) // 💡 Hits your active route path correctly!
      .set("Cookie", cookies)
      .send({ question: "Explain coding" });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/event-stream");
    expect(response.text).toContain("event:token\n");
    expect(response.text).toContain(`data: ${JSON.stringify({ token: "Functional " })}`);
  });

  it("should write a final done block event chunk down the wire to clear loading overlays", async () => {
    mockedAIStream.mockResolvedValue({
      async *[Symbol.asyncIterator]() {
        yield { text: "Done chunk context lines." };
      },
    });

    const response = await request(app)
      .post(`/api/notes/${noteId}/stream`)
      .set("Cookie", cookies)
      .send({ question: "Is stream finished?" });

    expect(response.text).toContain("event: done\n");
    expect(response.text).toContain("data: {}\n\n");
  });

  it("should record full compiled text inside database records on completion hooks", async () => {
    mockedAIStream.mockResolvedValue({
      async *[Symbol.asyncIterator]() {
        yield { text: "Continuous Stream Data." };
      },
    });

    await request(app)
      .post(`/api/notes/${noteId}/stream`)
      .set("Cookie", cookies)
      .send({ question: "Compile this record log" });

    const savedChats = await Chat.find({});
    expect(savedChats.length).toBe(1);
    expect(savedChats[0].answer).toBe("Continuous Stream Data.");
  });

  it("should reject empty question submissions with 400 Bad Request", async () => {
    const response = await request(app)
      .post(`/api/notes/${noteId}/stream`)
      .set("Cookie", cookies)
      .send({}); // Missing question payload entirely

    expect(response.status).toBe(400);
  });
});