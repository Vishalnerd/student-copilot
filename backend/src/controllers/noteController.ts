
import Note from "../models/note";
import NoteChunk from "../models/NoteChunk";
import Chat from "../models/Chat";
import { Request, Response } from "express";
import fs from "fs";
import  extractPdfText  from "../utils/extractPdfText";
import {generateEmbedding} from "../services/ai/embeddingService";
import chunkText from "../utils/chunkText";
import { AuthRequest } from "../middleware/authMiddleware";



export const uploadNote =
 async (
  req: AuthRequest,
  res: Response
 ) => {

 try {

  const file =
   req.file;

  if(!file){

   return res
    .status(400)
    .json({
      message:
       "No file uploaded",
    });

  }
  const content =
 await extractPdfText(
   file.path
 );
 const chunks =
 chunkText(content);
 
  const note =
   await Note.create({

    userId:
     req.userId,

    fileName:
     file.originalname,

    filePath:
     file.path,
    
    content,
   });
   for(
const [index,chunk]
of chunks.entries()
){

const embedding =
await generateEmbedding(
chunk
);

await NoteChunk.create({

noteId:note._id,

userId:req.userId,

chunkIndex:index,

content:chunk,

embedding

});

}
  res.status(201)
   .json(note);

 } catch(error){
  console.error(error);
  res.status(500)
   .json({
     message:
      "Server Error",
   });

 }

};

export const getMyNotes = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const notes =
      await Note.find({
        userId: req.userId,
      }).sort({
        createdAt: -1,
      });

    res.json(notes);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }

};

export const getNoteById =
 async (
  req: AuthRequest,
  res: Response
 ) => {

 try {

  const note =
   await Note.findOne({

    _id:
     req.params.id,

    userId:
     req.userId,

   });

  if(!note){

   return res
    .status(404)
    .json({
      message:
       "Note not found",
    });

  }

  res.json(note);

 } catch(error){

  res.status(500)
   .json({
    message:
     "Server Error",
   });

 }

};

export const deleteNote = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // Delete PDF from disk
    if (fs.existsSync(note.filePath)) {
      fs.unlinkSync(note.filePath);
    }

    // Delete Note
    await Note.findByIdAndDelete(note._id);

    // Delete Chunks
    await NoteChunk.deleteMany({
      noteId: note._id,
    });

    // Delete Chats
    await Chat.deleteMany({
      noteId: note._id,
    });

    return res.status(200).json({
      message: "Note deleted successfully",
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }
};

export const searchNotes = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const q =
      req.query.q as string;

    const notes =
      await Note.find({

        userId: req.userId,

        fileName: {

          $regex: q,

          $options: "i",

        },

      })
      .sort({
        createdAt: -1,
      });

    res.json(notes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

