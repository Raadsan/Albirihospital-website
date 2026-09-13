import multer from "multer";

// Use MemoryStorage so the file buffer can be streamed directly to S3
const storage = multer.memoryStorage();

// File filter: Only allow image formats
function fileFilter(req, file, cb) {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/svg+xml",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Nooca faylku waa qalad. Fadlan soo geli sawir (JPG, PNG, WEBP, GIF, SVG) oo kaliya."), false);
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per image
  },
});
