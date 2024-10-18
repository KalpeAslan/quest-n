import { Expose } from 'class-transformer';
import { IsEnum, IsInstance, IsNumber, Max } from 'class-validator';
import { constants } from '../../constants';

export enum ImageMimeType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  SVG = 'image/svg+xml',
}

export class ImageDto {
  @Expose()
  name!: string;

  @Expose()
  @IsInstance(Buffer)
  data!: Buffer;

  @Expose()
  @IsNumber()
  @Max(constants.maxImageSize - 1, { context: { value: constants.maxImageSize - 1 } })
  size!: number;

  @Expose()
  @IsEnum(ImageMimeType, { context: { values: Object.values(ImageMimeType) } })
  mimeType!: ImageMimeType;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      context: Record<string, any> & { formData: Record<string, any> };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      file: { buffer: Buffer; originalname: any; mimetype: any };
    }
  }
}
