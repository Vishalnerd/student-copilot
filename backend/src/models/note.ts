import mongoose,
{
 Document,
 Schema,
} from "mongoose";

export interface INote
 extends Document {

 userId: string;

 fileName: string;

 filePath: string;
}

const NoteSchema =
 new Schema(
 {
   userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
     required: true,
   },

   fileName: {
     type: String,
     required: true,
   },

   filePath: {
     type: String,
     required: true,
   },
    content: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

 },
 {
   timestamps: true,
 }
);

export default mongoose.model(
 "Note",
 NoteSchema
);