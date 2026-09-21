import multer from "multer";

// Use MemoryStorage so the file buffer can be streamed directly to S3
const storage = multer.memoryStorage();

// File filter: allow website images and common web video formats.
function fileFilter(req, file, cb) {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-m4v",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Nooca faylku waa qalad. Soo geli sawir ama video (MP4, WEBM, MOV)."), false);
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
