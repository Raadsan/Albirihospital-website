import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const REGION = process.env.AWS_REGION || "us-east-1";
const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "albirri-hospital-storage";
const ENDPOINT = process.env.AWS_ENDPOINT;

// Check if AWS S3 is fully configured
export const isS3Configured = Boolean(
  ACCESS_KEY_ID &&
  SECRET_ACCESS_KEY &&
  BUCKET_NAME &&
  ACCESS_KEY_ID.trim() !== "" &&
  SECRET_ACCESS_KEY.trim() !== ""
);

let s3Client = null;

if (isS3Configured) {
  const config = {
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  };

  if (ENDPOINT && ENDPOINT.trim() !== "") {
    config.endpoint = ENDPOINT.trim();
    config.forcePathStyle = true;
  }

  s3Client = new S3Client(config);
}

/**
 * Upload file to AWS S3 (or fallback to local disk storage if AWS keys are not yet set)
 * @param {Buffer} fileBuffer - Raw buffer of the file
 * @param {string} originalName - Original filename
 * @param {string} mimeType - File MIME type (image/png, image/jpeg, etc.)
 * @param {string} folder - Destination folder (default "uploads")
 * @returns {Promise<{ url: string, key: string, storage: "s3" | "local" }>}
 */
export async function uploadFile(fileBuffer, originalName, mimeType, folder = "uploads") {
  const fileExt = path.extname(originalName).toLowerCase() || ".jpg";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
  const key = `${folder}/${uniqueName}`;

  if (isS3Configured && s3Client) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    const fileUrl = ENDPOINT
      ? `${ENDPOINT.replace(/\/$/, "")}/${BUCKET_NAME}/${key}`
      : `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

    return {
      url: fileUrl,
      key,
      storage: "s3",
    };
  }

  // Fallback to local storage
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
 * Delete a file from AWS S3 or local storage
 * @param {string} key - File key or filename
 * @returns {Promise<boolean>}
 */
export async function deleteFile(key) {
  if (isS3Configured && s3Client) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  }

  // Fallback local deletion
  const localFilePath = path.resolve(process.cwd(), "uploads", path.basename(key));
  if (fs.existsSync(localFilePath)) {
    await fs.promises.unlink(localFilePath);
  }
  return true;
}
