import { IsNotEmpty, IsString } from 'class-validator';

export type TNotificationTypes =
  | 'scoreboard'
  | 'manual'
  | 'update'
  | 'luckyDraw'
  | 'guaranteed'
  | 'onBoarding'
  | 'experience';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  type: TNotificationTypes;

  payload: {
    userIDs?: number[];
    questId?: number;
  };
}
