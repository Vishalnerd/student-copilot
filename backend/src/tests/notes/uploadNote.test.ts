import request from "supertest";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

import app from "../../app";

import User from "../../models/user";
import Note from "../../models/note";
import NoteChunk from "../../models/NoteChunk";

import extractPdfText from "../../utils/extractPdfText";
import { generateEmbedding } from "../../services/ai/embeddingService";

jest.mock("../../utils/extractPdfText");

jest.mock("../../services/ai/embeddingService");

const mockedExtract =
extractPdfText as jest.Mock;

const mockedEmbedding =
generateEmbedding as jest.Mock;

describe("Upload Note API", () => {

let cookies:string;

beforeEach(async()=>{

mockedExtract.mockResolvedValue(

"This is Java. Java is OOP."

);

mockedEmbedding.mockResolvedValue(

[1,2,3]

);

const password=
await bcrypt.hash(

"Password123",

10

);

await User.create({

name:"Vishal",

email:"upload@test.com",

password,

});

const login=
await request(app)

.post("/api/auth/login")

.send({

email:"upload@test.com",

password:"Password123",

});

cookies=
login.headers["set-cookie"];

});

afterEach(()=>{

jest.clearAllMocks();

})

const pdfPath =
path.join(

__dirname,

"sample.pdf"

);

beforeAll(()=>{

fs.writeFileSync(

pdfPath,

"Fake PDF"

);

});

afterAll(()=>{

if(

fs.existsSync(pdfPath)

){

fs.unlinkSync(pdfPath);

}

});

it("should upload note",async()=>{

const response=

await request(app)

.post("/api/notes/upload")

.set(

"Cookie",

cookies

)

.attach(

"file",

pdfPath

);

expect(

response.status

).toBe(201);

});

it("should save note",async()=>{

await request(app)

.post("/api/notes/upload")

.set(

"Cookie",

cookies

)

.attach(

"file",

pdfPath

);

const notes=

await Note.find({});

expect(

notes.length

).toBe(1);

expect(

notes[0].content

)

.toContain(

"Java"

);

});

it("should create chunks",async()=>{

await request(app)

.post("/api/notes/upload")

.set(

"Cookie",

cookies

)

.attach(

"file",

pdfPath

);

const chunks=

await NoteChunk.find({});

expect(

chunks.length

)

.toBeGreaterThan(0);

});

it("should generate embeddings",async()=>{

await request(app)

.post("/api/notes/upload")

.set(

"Cookie",

cookies

)

.attach(

"file",

pdfPath

);

expect(

mockedEmbedding

)

.toHaveBeenCalled();

});


it("should reject missing file",async()=>{

const response=

await request(app)

.post("/api/notes/upload")

.set(

"Cookie",

cookies

);

expect(

response.status

).toBe(400);

});

it("should handle extraction failure",async()=>{

mockedExtract.mockRejectedValue(

new Error("PDF Error")

);

const spy=

jest.spyOn(

console,

"error"

)

.mockImplementation(()=>{});

const response=

await request(app)

.post("/api/notes/upload")

.set(

"Cookie",

cookies

)

.attach(

"file",

pdfPath

);

expect(

response.status

).toBe(500);

spy.mockRestore();

});

it("should handle embedding failure",async()=>{

mockedEmbedding.mockRejectedValue(

new Error("Embedding Error")

);

const spy=

jest.spyOn(

console,

"error"

)

.mockImplementation(()=>{});

const response=

await request(app)

.post("/api/notes/upload")

.set(

"Cookie",

cookies

)

.attach(

"file",

pdfPath

);

expect(

response.status

).toBe(500);

spy.mockRestore();

});

});


