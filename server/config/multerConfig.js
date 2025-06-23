import multer from 'multer';

export default {
  //only png and jpeg files
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Multer.File} file
   * @param {import('multer').FileFilterCallback} cb
   * @returns
   */
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new Error('LIMIT_INVALID_TYPE'));
    }

    return cb(null, true);
  },
  //file size limit
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  storage: multer.memoryStorage(),
};
