import cloudinary from "../../config/cloudinary";

export async function uploadPdf(
  filePath: string
) {
  const result = await cloudinary.uploader.upload(
    filePath,
    {
      resource_type: "raw",
      folder: "student-copilot/pdfs",
    }
  );

  return result;
}