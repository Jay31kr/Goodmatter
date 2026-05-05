import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (filePath) => {
    console.log("Cloudinary config:", cloudinary.config());
  if (!filePath) throw new Error("File path required");

  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "auto",
    folder: "pitch_decks",
    type: "upload",
    access_mode: "public"
  });

  return result;
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  return result;
};