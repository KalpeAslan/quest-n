import { getConfig } from '../config';
const { S3_BUCKET } = getConfig();

export const generateS3Path = (fileName: string) => {
  if (!fileName) return fileName;

  const fullUrl = 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + fileName;

  return fullUrl;
};
