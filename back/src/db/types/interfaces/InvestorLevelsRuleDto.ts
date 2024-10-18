export class InvestorLevelsRuleDto {
  number!: number;
  tokensFrom!: number;
  name!: string;
  avatar!: string;
}

export class CreateOrReplaceInvestorLevelsRuleDto {
  rules!: InvestorLevelsRuleDto[];
}
