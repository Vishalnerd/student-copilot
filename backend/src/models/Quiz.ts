import mongoose from"mongoose";

/**
 * noteId

userId

question

options

correctAnswer
 */
const quizSchema = new mongoose.Schema({
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
    options: {
    type: [String],
    required: true,
  },
    correctAnswer: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

export default mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);