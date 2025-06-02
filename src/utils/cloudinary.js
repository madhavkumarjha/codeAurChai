import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded successfull
    // console.log("file is uploaded on cloudinary", response.url);

    // Remove the local file after successful upload
    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temporary file as the upload option failed
    return null;
  }
};

const extractPublicId = (url) => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];   // e.g., zzotygqecztktpipxzg2.png
  return fileName.split('.')[0]; // removes .png or .jpg etc.
};

const deleteImageOnCloudinary = async (url) => {
  try {
    const publicId = extractPublicId(url);
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return res.result === "ok";
  } catch (error) {
    console.log("Image deletion failed:", error);
    return false;
  }
};

const deleteVideoOnCloudinary = async (url) => {
  try {
    const publicId = extractPublicId(url);
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return res.result === "ok";
  } catch (error) {
    console.log("Video deletion failed:", error);
    return false;
  }
};




export { uploadOnCloudinary,deleteImageOnCloudinary,deleteVideoOnCloudinary };
