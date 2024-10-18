import { investorModel, contractModel } from '../../../db/models';
import { Investor, Contract } from '../../../db/entity';
import { getConfig } from '../../config';
import { CreateContractDto } from '../../../db/types/interfaces/contractDto';
import { ConflictError, ConflictErrorKeys } from '../../errors';
import { TokenType } from '../../../db/types/interfaces/loyalty';

const LIMIT_OF_MAX_TOKENS = 5;
export const createToken = async (data: CreateContractDto, investorId: number) => {
  const investor = (await investorModel.getByInvestorId(investorId)) as Investor;
  const token = dataToToken(data, investor);
  const tokens = await contractModel.getTokensOfInvestor(investorId);
  if (
    data.type === TokenType.Token &&
    tokens.filter((token) => token.type === TokenType.Token).length >= LIMIT_OF_MAX_TOKENS
  ) {
    throw new ConflictError(ConflictErrorKeys.MaxTokensLimit, `Max tokens limit is ${LIMIT_OF_MAX_TOKENS}`);
  }

  if (
    data.type === TokenType.Nft &&
    tokens.filter((token) => token.type === TokenType.Nft).length >= LIMIT_OF_MAX_TOKENS
  ) {
    throw new ConflictError(ConflictErrorKeys.MaxTokensLimit, `Max tokens limit is ${LIMIT_OF_MAX_TOKENS}`);
  }

  const computeTokenOfInvestorIsExist = (token: Contract) => token.symbol.toLowerCase() === data.symbol.toLowerCase();

  if (tokens.some(computeTokenOfInvestorIsExist))
    throw new ConflictError(ConflictErrorKeys.TokenAlreadyExists, `Token ${data.symbol} is already exist`);
  const savedToken = await contractModel.create(token);
  return savedToken.id;
};

export const dataToToken = (data: CreateContractDto, investor: Investor) => {
  const token = new Contract();
  const config = getConfig();
  if (data.logo) {
    token.logo = data.logo || config.DEFAULT_PARTNER_PROJECT_LOGO;
  }
  token.name = data.name || '';
  token.symbol = data.symbol;
  token.investorId = investor?.id || null;
  if (investor) token.investor = investor;
  token.type = data.type;

  return token;
};
