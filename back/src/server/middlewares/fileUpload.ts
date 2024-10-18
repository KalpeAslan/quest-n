import multer from 'multer';
import { constants } from '../config/constants';
import { BadRequestError, BadRequestErrorKeys } from '../errors';

export const fileUpload = (type: 'file' | 'image') => {
  if (type !== 'image')
    return multer({ limits: { fileSize: constants.maxImageSize, fieldSize: constants.maxImageSize } });
  return multer({
    fileFilter: function (req, file, cb: any) {
      if (!constants.allowedImageUploadTaskFormats.includes(file.mimetype)) {
        return cb(new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Invalid file type.'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: constants.maxImageSizeUploadTask, fieldSize: constants.maxImageSizeUploadTask },
  });
};
