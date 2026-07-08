import request from "supertest";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import app from "../../app";
import User from "../../models/user";
import Note from "../../models/note";
import { pdfQueue } from "../../jobs/pdfQueue";

// 💡 Mock the BullMQ processing queue infrastructure safely
jest.mock("../../jobs/pdfQueue", () => ({
  pdfQueue: {
    add: jest.fn().mockResolvedValue({ id: "mock-job-id" }),
  },
}));

describe("Upload Note API (BullMQ Orchestrator)", () => {
  let cookies: string;
  const pdfPath = path.join(__dirname, "sample.pdf");

  beforeAll(() => {
    fs.writeFileSync(pdfPath, "Fake PDF");
  });

  afterAll(() => {
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});
    jest.clearAllMocks();

    const password = await bcrypt.hash("Password123", 10);
    await User.create({
      name: "Vishal",
      email: "upload@test.com",
      password,
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "upload@test.com",
        password: "Password123",
      });

    cookies = login.headers["set-cookie"];
  });

  it("should upload note and return 202 accepted status", async () => {
    const response = await request(app)
      .post("/api/notes/upload")
      .set("Cookie", cookies)
      .attach("file", pdfPath);

    expect(response.status).toBe(202);
  });

  it("should save note metadata shell with pending tracking states", async () => {
    await request(app)
      .post("/api/notes/upload")
      .set("Cookie", cookies)
      .attach("file", pdfPath);

    const notes = await Note.find({});
    expect(notes.length).toBe(1);
    expect(notes[0].fileName).toBe("sample.pdf");
    expect(notes[0].status).toBe("processing"); // 💡 Content is unparsed until worker fires
  });

  it("should queue pdf processing task inside BullMQ", async () => {
    await request(app)
      .post("/api/notes/upload")
      .set("Cookie", cookies)
      .attach("file", pdfPath);

    expect(pdfQueue.add).toHaveBeenCalledWith(
      "process-pdf",
      expect.objectContaining({
        noteId: expect.any(String),
      })
    );
  });

  it("should reject missing file with 400 Bad Request", async () => {
    const response = await request(app)
      .post("/api/notes/upload")
      .set("Cookie", cookies);

    expect(response.status).toBe(400);
    expect(pdfQueue.add).not.toHaveBeenCalled();
  });
});