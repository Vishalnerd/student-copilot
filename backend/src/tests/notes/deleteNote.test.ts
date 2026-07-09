import request from "supertest";
import bcrypt from "bcryptjs";
import {deletePdf} from "../../services/cloudStorage/cloudinaryService"
import app from "../../app";

import User from "../../models/user";
import Note from "../../models/note";
import NoteChunk from "../../models/NoteChunk";
import Chat from "../../models/Chat";

jest.mock("../../services/cloudStorage/cloudinaryService", () => ({
  deletePdf: jest.fn().mockResolvedValue({}),
}));

describe("Delete Note API", () => {

  let cookies: string;
  let noteId: string;
  let userId: string;

  beforeEach(async () => {

    const fileUrl =
  "https://res.cloudinary.com/demo/raw/upload/v1/delete.pdf";

    const password =
      await bcrypt.hash(
        "Password123",
        10
      );

    const user =
      await User.create({

        name: "Vishal",

        email: "delete@test.com",

        password,

      });

    userId =
      user._id.toString();

    const login =
      await request(app)

        .post("/api/auth/login")

        .send({

          email: "delete@test.com",

          password: "Password123",

        });

    cookies =
      login.headers["set-cookie"];

    const note =
      await Note.create({

        userId,

        fileName: "Delete.pdf",

        fileUrl,

        cloudinaryId: "delete-id",

        content: "Delete Me",

      });

    noteId =
      note._id.toString();

    await NoteChunk.create({

      noteId,

      userId,

      chunkIndex: 0,

      content: "chunk",

      embedding: [1,2,3],

    });

    await Chat.create({

      noteId,

      userId,

      question: "Hello",

      answer: "World",

    });

  });

  afterEach(() => {
    jest.clearAllMocks();
    

  });

  it("should delete cloudinary file", async () => {

    await request(app)

        .delete(`/api/notes/${noteId}`)

        .set(
          "Cookie",
          cookies
        );
    const mockedDeletePdf = deletePdf as jest.Mock;
    expect(mockedDeletePdf)
      .toHaveBeenCalledWith("delete-id");

  });

  it("should remove note", async () => {

    await request(app)

      .delete(`/api/notes/${noteId}`)

      .set(
        "Cookie",
        cookies
      );

    const note =
      await Note.findById(
        noteId
      );

    expect(note)
      .toBeNull();

  });

  it("should remove chunks", async () => {

    await request(app)

      .delete(`/api/notes/${noteId}`)

      .set(
        "Cookie",
        cookies
      );

    const chunks =
      await NoteChunk.find({
        noteId,
      });

    expect(chunks)
      .toHaveLength(0);

  });

  it("should remove chats", async () => {

    await request(app)

      .delete(`/api/notes/${noteId}`)

      .set(
        "Cookie",
        cookies
      );

    const chats =
      await Chat.find({
        noteId,
      });

    expect(chats)
      .toHaveLength(0);

  });


  it("should return 404", async () => {

    const response =
      await request(app)

        .delete(
          "/api/notes/685555555555555555555555"
        )

        .set(
          "Cookie",
          cookies
        );

    expect(response.status)
      .toBe(404);

  });

  it("should reject unauthorized", async () => {

    const response =
      await request(app)

        .delete(
          `/api/notes/${noteId}`
        );

    expect(response.status)
      .toBe(401);

  });

});