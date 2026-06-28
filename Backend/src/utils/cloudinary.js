import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localfilePath, folder) => {
  try {
    if (!localfilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "image",
      folder: folder,
    });
    console.log("file is uploaded", response.url);
   // fs.unlinkSync(localfilePath);

    return response;
  } catch (error) {
   // fs.unlinkSync(localfilePath);
    console.log(`Problem at uploading data at ${folder}`, error);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      return null;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("File deleted:", result);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
