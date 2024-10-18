export class TokenAmount {
  id!: number;
  amount!: number;
}

export class CreateOrReplaceRewardsDto {
  startPlace?: number;
  endPlace?: number;
  tokens!: TokenAmount[];
  whitelisting?: boolean;
  whitelistingName: boolean;
}
