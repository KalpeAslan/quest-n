import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @Expose()
  @IsString()
  oldPassword!: string;

  @Expose()
  @IsString()
  newPassword!: string;
}
