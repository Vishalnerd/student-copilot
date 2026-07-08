import { Response } from "express";
import mongoose from "mongoose";
import Chat from "../models/Chat";
import { AuthRequest } from "../middleware/authMiddleware";

/**
 * Get chat history for the authenticated user
 */

export const getChatHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const history = await Chat.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
        },
      },

      {
        $sort: {
          createdAt: -1,
        },
      },

      {
        $group: {
          _id: "$noteId",

          lastQuestion: {
            $first: "$question",
          },
          lastAnswer: {
            $first: "$answer",
          },


          updatedAt: {
            $first: "$updatedAt",
          },

          questionCount: {
            $sum: 1,
          },
        },
      },

      {
        $lookup: {
          from: "notes",
          localField: "_id",
          foreignField: "_id",
          as: "note",
        },
      },

      {
        $unwind: "$note",
      },

      {
        $project: {

          noteId: "$_id",

          fileName: "$note.fileName",

          lastQuestion: 1,
          
          lastAnswer: 1,

          questionCount: 1,

          updatedAt: 1,
        },
      },

      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    res.json(history);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
/**
 * Get recent chat history for the authenticated user
 */
export const getRecentChatHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
   const chats = await Chat.aggregate([
  {
    $match: {
      userId: new mongoose.Types.ObjectId(req.userId),
    },
  },

  {
    $sort: {
      createdAt: -1,
    },
  },

  {
    $lookup: {
      from: "notes",
      localField: "noteId",
      foreignField: "_id",
      as: "note",
    },
  },

  {
    $unwind: "$note",
  },

  {
    $project: {
      _id: 1,
      question: 1,
      noteId: 1,
      createdAt: 1,
      fileName: "$note.fileName",
    },
  },

  {
    $limit: 5,
  },
]);

    res.json(chats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Get chat history for a specific note
 */

export const getChatsByNote = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const chats = await Chat.find({
      userId: req.userId,
      noteId: req.params.noteId,
    }).sort({
      createdAt: 1,
    });

    if(!chats.length) {
      return res.status(404).json({
        message: "No chat history found for this note",
      });
    }

    res.json(chats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

/**
 * Delete chat history for a specific note
 */

export const deleteChatHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
   const result = await Chat.deleteMany({
    userId: req.userId,
    noteId: req.params.noteId,
   });

    return res.json({
      message: "History deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

