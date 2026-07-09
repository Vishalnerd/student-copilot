// services/cloudStorage/cloudinaryService.ts

import cloudinary from "../../config/cloudinary";

export async function uploadPdf(filePath: string) {
  return cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "student-copilot/pdfs",
  });
}

export async function deletePdf(publicId: string) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
}