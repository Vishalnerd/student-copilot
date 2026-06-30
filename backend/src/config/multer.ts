import multer, { Options } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter: Options["fileFilter"] = (_req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDFs allowed"));
  }

  cb(null, true);
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});