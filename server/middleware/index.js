import multer from 'multer';
import multerConfig from '../config/multerConfig.js';

const checkLogin = (req, res, next) => {
  // Prevent access to route if user isn't logged in
  if (!req.session.userId) {
    return res.status(401).json({
      status: 401,
      error: 'Unauthorized',
    });
  }

  return next();
};

const checkImageFile = (req, res, next) => {
  const upload = multer(multerConfig).single('image');

  // Handle incorrect files
  upload(req, res, async (err) => {
    if (err) {
      try {
        console.log(err.code);
        switch (err.code) {
          case 'LIMIT_INVALID_TYPE':
            throw new Error('Invalid file type. Only PNG and JPEG are allowed');

          case 'LIMIT_FILE_SIZE':
            throw new Error('File size is too large. There is a max size of 5MB');

          default:
            throw new Error('There was an error receiving the file');
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({
          status: 400,
          error: err.message,
        });
      }
    } else {
      return next();
    }
  });
};

export default { checkLogin, checkImageFile };
