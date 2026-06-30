import multer, { Options } from "multer";
import { Request } from "express";

// 1. Configure Disk Storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, "uploads");
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// 2. Configure File Filter with explicit Types
const fileFilter: Options["fileFilter"] = (_req: Request, file: Express.Multer.File, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDFs allowed"));
  }
  cb(null, true);
};

// 3. Export Multer instance
export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});