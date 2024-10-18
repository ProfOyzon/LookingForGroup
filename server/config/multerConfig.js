import multer, { MulterError } from "multer";

export default {
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      return cb(new MulterError("LIMIT_INVALID_TYPE"));
    }

    return cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  storage: multer.memoryStorage(),
};