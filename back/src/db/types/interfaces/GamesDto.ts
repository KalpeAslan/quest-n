import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class GamesInfoDto {
  @Expose()
  @IsString()
  user_id: string;

  @Expose()
  @IsInt()
  session_id: number;

  @Expose()
  @IsString()
  token: string;

  @Expose()
  @IsString()
  sign: string;
}

export class GamesBetDto {
  @Expose()
  @IsString()
  user_id: string;

  @Expose()
  @IsInt()
  session_id: number;

  @Expose()
  @IsString()
  round_id: string;

  @Expose()
  @IsString()
  tx_id: string;

  @Expose()
  @IsInt()
  amount: number;

  @Expose()
  @IsString()
  game_bundle: string;

  @Expose()
  @IsString()
  token: string;

  @Expose()
  @IsString()
  sign: string;
}

export class GamesWinDto {
  @Expose()
  @IsString()
  user_id: string;

  @Expose()
  @IsInt()
  session_id: number;

  @Expose()
  @IsString()
  round_id: string;

  @Expose()
  @IsString()
  tx_id: string;

  @Expose()
  @IsString()
  ref_tx_id: string;

  @Expose()
  @IsInt()
  amount: number;

  @Expose()
  @IsBoolean()
  round_closed: boolean;

  @Expose()
  @IsString()
  game_bundle: string;

  @Expose()
  @IsString()
  token: string;

  @Expose()
  @IsString()
  sign: string;
}

export class GamesCancelDto {
  @Expose()
  @IsString()
  user_id: string;

  @Expose()
  @IsString()
  tx_id: string;

  @Expose()
  @IsString()
  ref_tx_id: string;

  @Expose()
  @IsInt()
  session_id: number;

  @Expose()
  @IsString()
  round_id: string;

  @Expose()
  @IsString()
  game_bundle: string;

  @Expose()
  @IsString()
  token: string;

  @Expose()
  @IsString()
  sign: string;
}
