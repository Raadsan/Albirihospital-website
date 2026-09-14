import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

export const isCloudinaryConfigured = Boolean(
  (CLOUD_NAME && API_KEY && API_SECRET && CLOUD_NAME.trim() !== "") ||
  (CLOUDINARY_URL && CLOUDINARY_URL.trim() !== "")
);

if (isCloudinaryConfigured) {
  if (CLOUDINARY_URL) {
    cloudinary.config();
  } else {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
      secure: true,
    });
  }
}

/**
 * Upload a file buffer to Cloudinary (or fallback to local disk storage if Cloudinary keys are not yet set)
 * @param {Buffer} fileBuffer - Raw buffer of the file
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type (image/png, image/jpeg, etc.)
 * @param {string} folder - Destination folder in Cloudinary (default "albirri-hospital")
 * @returns {Promise<{ url: string, key: string, storage: "cloudinary" | "local" }>}
 */
export async function uploadFile(fileBuffer, originalName, mimeType, folder = "albirri-hospital") {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `albirri-hospital/${folder}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload stream error:", error);
            return reject(error);
          }
          resolve({
            url: result.secure_url,
            key: result.public_id,
            storage: "cloudinary",
          });
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Fallback to local storage if Cloudinary is not yet configured
  const fileExt = path.extname(originalName).toLowerCase() || ".jpg";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
  const uploadDir = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const localFilePath = path.join(uploadDir, uniqueName);
  await fs.promises.writeFile(localFilePath, fileBuffer);

  const port = process.env.PORT || 5000;
  const host = process.env.HOST || "127.0.0.1";
  const fileUrl = `http://${host}:${port}/uploads/${uniqueName}`;

  return {
    url: fileUrl,
    key: uniqueName,
    storage: "local",
  };
}

/**
 * Delete a file from Cloudinary or local storage
 * @param {string} key - Cloudinary public_id or local filename
 * @returns {Promise<boolean>}
 */
export async function deleteFile(key) {
  if (isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(key);
      return true;
    } catch (err) {
      console.error("Cloudinary delete error:", err);
      return false;
    }
  }

  // Fallback local deletion
  const localFilePath = path.resolve(process.cwd(), "uploads", path.basename(key));
  if (fs.existsSync(localFilePath)) {
    await fs.promises.unlink(localFilePath);
  }
  return true;
}
