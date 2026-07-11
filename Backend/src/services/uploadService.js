import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Initialize Cloudinary dynamically
const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured in environment variables.");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
};

/**
 * Validate image extension and mimetype.
 */
export const validateImage = (file) => {
  if (!file) {
    throw new Error("No file provided.");
  }
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const allowedMimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/webp/;

  const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedMimeTypes.test(file.mimetype);

  if (!extName || !mimeType) {
    throw new Error("Invalid file format. Only JPG, JPEG, PNG, and WEBP images are supported.");
  }
  return true;
};

/**
 * Validate image file size (max 5MB).
 */
export const validateFileSize = (file) => {
  if (!file) {
    throw new Error("No file provided.");
  }
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("File size exceeds the maximum limit of 5 MB.");
  }
  return true;
};

/**
 * Generate logical Cloudinary folder path based on type.
 */
export const generateFolderPath = (type) => {
  const folders = {
    profile: "krishi-mitra/profile-images",
    listing: "krishi-mitra/listing-images",
    crop: "krishi-mitra/crop-images",
    chat: "krishi-mitra/chat-images",
    farm: "krishi-mitra/farms",
    government: "krishi-mitra/government",
    news: "krishi-mitra/news",
    document: "krishi-mitra/documents",
  };
  return folders[type] || "krishi-mitra/general";
};

/**
 * Optimize image transformation settings.
 */
export const optimizeImage = () => {
  return [
    { width: 1000, height: 1000, crop: "limit" }, // limit large images
    { quality: "auto" }, // automatic quality compression
    { fetch_format: "auto" }, // webp/optimal delivery formats
  ];
};

/**
 * Helper to delete a local file safely.
 */
const cleanLocalFile = async (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Local temporary file removed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error cleaning local temporary file ${filePath}:`, error.message);
  }
};

/**
 * 1. Upload a single image to Cloudinary.
 * 
 * @param {object} file - Local Multer file object.
 * @param {string} folderType - Folder category (e.g. profile, listing, crop, chat).
 * @returns {Promise<object>} Upload response payload.
 */
export const uploadImage = async (file, folderType = "general") => {
  try {
    // 1. Validate file parameters
    validateImage(file);
    validateFileSize(file);

    // 2. Resolve folder path
    const folder = generateFolderPath(folderType);

    // 3. Configure Cloudinary
    const client = getCloudinaryConfig();

    // 4. Upload to Cloudinary
    console.log(`Uploading file ${file.originalname} to folder ${folder}...`);
    const result = await client.uploader.upload(file.path, {
      folder: folder,
      resource_type: "image",
      transformation: optimizeImage(),
    });

    console.log(`Cloudinary upload successful for ${file.originalname}`);

    // 5. Clean up local file asynchronously
    await cleanLocalFile(file.path);

    return {
      success: true,
      message: "Image uploaded successfully",
      data: {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      },
    };
  } catch (error) {
    console.error("Cloudinary single image upload failure:", error.message);
    // Ensure local file is removed even on failure to prevent disk space leaks
    if (file && file.path) {
      await cleanLocalFile(file.path);
    }
    return {
      success: false,
      message: error.message || "Upload failure",
    };
  }
};

/**
 * 2. Upload multiple images to Cloudinary.
 * 
 * @param {Array<object>} files - Array of Multer file objects.
 * @param {string} folderType - Folder category.
 * @returns {Promise<Array<object>>} Array of upload response payloads.
 */
export const uploadMultipleImages = async (files, folderType = "general") => {
  try {
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new Error("No files provided for batch upload.");
    }

    console.log(`Starting batch upload for ${files.length} images...`);
    const uploadPromises = files.map((file) => uploadImage(file, folderType));
    const results = await Promise.all(uploadPromises);

    return results;
  } catch (error) {
    console.error("Cloudinary batch upload failure:", error.message);
    return [{
      success: false,
      message: error.message || "Batch upload failure",
    }];
  }
};

/**
 * 3. Delete an asset from Cloudinary.
 * 
 * @param {string} publicId - Cloudinary asset ID.
 * @returns {Promise<object>} Deletion response payload.
 */
export const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Asset publicId is required for deletion.");
    }

    const client = getCloudinaryConfig();
    console.log(`Deleting Cloudinary asset with publicId: ${publicId}...`);
    const result = await client.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log(`Cloudinary asset deleted successfully: ${publicId}`);
      return {
        success: true,
        message: "Image deleted successfully",
      };
    } else {
      throw new Error(`Cloudinary returned status: ${result.result}`);
    }
  } catch (error) {
    console.error("Cloudinary asset deletion failure:", error.message);
    return {
      success: false,
      message: error.message || "Delete failure",
    };
  }
};

/**
 * 4. Replace an existing image asset.
 * 
 * @param {string} oldPublicId - Asset ID to delete.
 * @param {object} newFile - Multer file object to upload.
 * @param {string} folderType - Folder category.
 * @returns {Promise<object>} Upload response payload.
 */
export const replaceImage = async (oldPublicId, newFile, folderType = "general") => {
  try {
    // Delete the old asset first
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }
    // Upload the new asset
    return await uploadImage(newFile, folderType);
  } catch (error) {
    console.error("Cloudinary asset replacement failure:", error.message);
    return {
      success: false,
      message: error.message || "Replacement failure",
    };
  }
};

// ── CUSTOM CONTROLLER WRAPPERS ────────────────────────────────────────────────

export const uploadProfileImage = async (file) => {
  return await uploadImage(file, "profile");
};

export const uploadListingImage = async (file) => {
  return await uploadImage(file, "listing");
};

export const uploadCropImage = async (file) => {
  return await uploadImage(file, "crop");
};

export const uploadChatImage = async (file) => {
  return await uploadImage(file, "chat");
};

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  replaceImage,
  validateImage,
  validateFileSize,
  generateFolderPath,
  optimizeImage,
  uploadProfileImage,
  uploadListingImage,
  uploadCropImage,
  uploadChatImage,
};
