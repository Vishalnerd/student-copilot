import { Request, Response } from "express";

import Note from "../../models/note";
import {generateSummaryService} from "../../services/prompts/summaryService";
import { AuthRequest } from "../../middleware/authMiddleware";


export const generateSummary = async (
    req: AuthRequest,
    res: Response
) => {

    try {

        const note =
            await Note.findOne({

                _id: req.params.id,

                userId: req.userId

            });

        if (!note) {

            return res.status(404).json({
                message: "Note not found"
            });

        }

        if (note.summary) {

            return res.json({

                summary: note.summary,

                cached: true

            });

        }

        const summary =
            await generateSummaryService(
                note.content
            );

        note.summary = summary;

        await note.save();

        res.json({

            summary,

            cached: false

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};