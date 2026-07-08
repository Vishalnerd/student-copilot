import mongoose from "mongoose";

const NoteChunkSchema =
 new mongoose.Schema({

  noteId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"Note",
   required:true,
  },

  userId:{
   type:mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true,
  },
  chunkIndex: {
 type:Number,
 required:true,
},
  content:{
   type:String,
   required:true,
  },
embedding: {
    type: [Number],
    default: [],
},
 },
{
  timestamps:true,
});

NoteChunkSchema.index({
  noteId: 1,
  userId: 1,
});

NoteChunkSchema.index({
  noteId: 1,
});

NoteChunkSchema.index({
  userId: 1,
});
export default mongoose.model(
 "NoteChunk",
 NoteChunkSchema
);