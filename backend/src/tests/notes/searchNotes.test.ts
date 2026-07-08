import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../app";
import User from "../../models/user";
import Note from "../../models/note";

describe("Search Notes API Integration Suite", () => {
  let primaryUserCookies: string;
  let primaryUserId: string;

  beforeEach(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});
    jest.clearAllMocks();

    const password = await bcrypt.hash("Password123", 10);
    
    // Setup Primary User
    const user = await User.create({
      name: "Vishal",
      email: "search@test.com",
      password,
    });
    primaryUserId = user._id.toString();

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "search@test.com",
        password: "Password123",
      });

    primaryUserCookies = login.headers["set-cookie"];
  });

  it("should search notes successfully for authenticated user", async () => {
    await Note.create({
      userId: primaryUserId,
      fileName: "Java Notes.pdf",
      filePath: "/tmp/java.pdf",
      content: "Java",
    });

    await Note.create({
      userId: primaryUserId,
      fileName: "Node Notes.pdf",
      filePath: "/tmp/node.pdf",
      content: "Node",
    });

    const response = await request(app)
      .get("/api/notes/search")
      .query({ q: "Java" })
      .set("Cookie", primaryUserCookies);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].fileName).toContain("Java");
  });

  it("should return empty array when no query matches exist", async () => {
    const response = await request(app)
      .get("/api/notes/search")
      .query({ q: "Python" })
      .set("Cookie", primaryUserCookies);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("should isolate user search boundaries cleanly", async () => {
    const password = await bcrypt.hash("Password123", 10);
    
    // 💡 Explicitly create a distinct secondary user profile 
    const otherUser = await User.create({
      name: "Other User",
      email: "other@test.com",
      password,
    });

    // Create a note that belongs strictly to the other user
    await Note.create({
      userId: otherUser._id,
      fileName: "Java Secret.pdf",
      filePath: "/tmp/x.pdf",
      content: "Secret",
    });

    // Execute search authenticated as the primary user
    const response = await request(app)
      .get("/api/notes/search")
      .query({ q: "Java" })
      .set("Cookie", primaryUserCookies);

    // The primary user should not see the secondary user's note
    expect(response.body).toHaveLength(0);
  });

  it("should reject unauthorized requests with 401 status", async () => {
    const response = await request(app)
      .get("/api/notes/search")
      .query({ q: "Java" })
      .set("Cookie", ["accessToken=invalid-or-expired-token-string"]); 

    expect(response.status).toBe(401);
  });
});