import { nanoid } from 'nanoid';
import { getConfig } from '../config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ImageDto } from '../../db/types/interfaces/ImageDto';
import sharp from 'sharp';

export const saveImage = async (saveImageDto: ImageDto) => {
  // const { S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = getConfig();

  const Key = nanoid(10) + '.' + saveImageDto.mimeType.split('/')[1];

  return Key;
  // const uploadParams = {
  //   Bucket: S3_BUCKET,
  //   Key,
  //   Body: saveImageDto.data,
  //   ContentType: saveImageDto.mimeType,
  //   CacheControl: 'max-age=31536000',
  // };
  //
  // const data = await new S3Client({
  //   credentials: {
  //     accessKeyId: AWS_ACCESS_KEY_ID,
  //     secretAccessKey: AWS_SECRET_ACCESS_KEY,
  //   },
  //   region: AWS_REGION,
  // }).send(new PutObjectCommand(uploadParams));
  // if (data?.$metadata?.httpStatusCode === 200) return Key;
  return false;
};

export const compressImage = async (buffer: Buffer, width?: number) => {
  return await sharp(buffer)
    .resize({ width: width || 96 })
    .png({ quality: 50 })
    .toBuffer();
};
