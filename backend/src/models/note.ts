import mongoose,
{
 Document,
 Schema,
} from "mongoose";



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
    status: {
  type: String,
  enum: ["processing", "completed", "failed"],
  default: "processing",
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