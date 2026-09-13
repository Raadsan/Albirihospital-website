import { uploadFile, deleteFile, isS3Configured } from "../utils/s3.js";

/**
 * @desc    Upload a single image to AWS S3 (or local fallback)
 * @route   POST /api/upload
 * @access  Private (ADMIN ONLY)
 */
export async function uploadSingleImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Fadlan soo dooro sawir (No image file provided)",
      });
    }

    const folder = req.body.folder || "uploads";
    const result = await uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    return res.status(200).json({
      success: true,
      message: isS3Configured
        ? "Sawirka si guul leh ayaa loogu shubay AWS S3"
        : "Sawirka si guul leh ayaa loo keydiyay (Local fallback - Configure AWS in .env for S3)",
      url: result.url,
      key: result.key,
      storage: result.storage,
    });
  } catch (error) {
    console.error("Upload Single Image Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii sawirka la shubayay (Upload failed)",
    });
  }
}

/**
 * @desc    Upload multiple images
 * @route   POST /api/upload/multiple
 * @access  Private (ADMIN ONLY)
 */
export async function uploadMultipleImages(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Fadlan soo dooro ugu yaraan hal sawir (No image files provided)",
      });
    }

    const folder = req.body.folder || "uploads";

    const uploadPromises = req.files.map((file) =>
      uploadFile(file.buffer, file.originalname, file.mimetype, folder)
    );

    const results = await Promise.all(uploadPromises);

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Upload Multiple Images Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii sawirada la shubayay (Upload failed)",
    });
  }
}

/**
 * @desc    Delete an uploaded image
 * @route   DELETE /api/upload
 * @access  Private (ADMIN ONLY)
 */
export async function deleteUploadedImage(req, res) {
  try {
    const key = req.body.key || req.query.key;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "Fadlan soo geli key-ga sawirka (File key required)",
      });
    }

    await deleteFile(key);

    return res.status(200).json({
      success: true,
      message: "Sawirka si buuxda ayaa loo tirtiray",
    });
  } catch (error) {
    console.error("Delete Image Error:", error);
    return res.status(500).json({
      success: false,
      error: "Khalad ayaa dhacay markii sawirka la tirtirayay (Delete failed)",
    });
  }
}
