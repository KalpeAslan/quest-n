import { plainToClass } from 'class-transformer';
import { ImageDto, ImageMimeType } from '../../../../../db/types/interfaces/ImageDto';
import { saveImage } from '../../../image';
import { validate } from 'class-validator';

export const isImageLoyaltyTask = async (requestBody) => {
  const fileName = `imageUploadTask_${requestBody.originalname}_${new Date().getTime()}`;

  const saveImageDto = plainToClass(
    ImageDto,
    { ...requestBody, name: fileName, data: requestBody.buffer, mimeType: requestBody.mimetype },
    {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    },
  );

  const validationErrors = await validate(saveImageDto, { validationError: { target: false, value: false } });

  if (validationErrors.length) {
    throw validationErrors[0];
  }

  const imgSrc = await saveImage({
    ...saveImageDto,
    mimeType: ImageMimeType.PNG,
  });

  return {
    status: true,
    json: {
      imgSrc,
    },
  };
};
