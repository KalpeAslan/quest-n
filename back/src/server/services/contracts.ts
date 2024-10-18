import Web3 from 'web3';
const web3 = new Web3();
import { contractModel } from '../../db/models';
import { getConfig } from '../config';
import { constants } from '../config/constants';
import { getHashFromDeployer } from './blockchain/reward/alphaDeployer';
import { compressImage, saveImage } from './image';
import { plainToClass } from 'class-transformer';
import { ImageDto, ImageMimeType } from '../../db/types/interfaces/ImageDto';
import { NotFoundError, NotFoundErrorKeys } from '../errors/NotFoundError';
import { CreateContractDto, CreateTokenContractDto, TokenStandardDto } from '../../db/types/interfaces/contractDto';
import { BadRequestError, BadRequestErrorKeys, ConflictError, ConflictErrorKeys } from '../errors';
import { getDecimals, getName, getSymbol } from './blockchain/erc20';
import { Contract } from '../../db/entity';
import { TokenType } from '../../db/types/interfaces/loyalty';
const { APP_HOST, CONTRACT_PRIVATE_KEY } = getConfig();

export const createNftContract = async (investorId: number, file: any, data: CreateContractDto) => {
  if (!file) throw new NotFoundError(NotFoundErrorKeys.NotFound, "File doesn't exist");
  const saveImageDto = plainToClass(
    ImageDto,
    { ...file, name: file.originalname, data: file.buffer, mimeType: file.mimetype },
    {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    },
  );

  const compressedBuffer = await compressImage(saveImageDto.data, 345);
  const compressedSize = compressedBuffer.toString().length;

  const imageUrl = await saveImage({
    ...saveImageDto,
    size: compressedSize,
    data: compressedBuffer,
    mimeType: ImageMimeType.PNG,
  });

  const contract = await contractModel.create({
    name: data.name,
    symbol: data.symbol,
    logo: imageUrl || null,
    chainId: data.chainId,
    address: null,
    standard: data.standard,
    type: data.type,
    investorId: investorId,
  });

  const hashBody = {
    userId: investorId,
    collectionId: contract.id,
    name: data.name,
    symbol: data.symbol,
    baseUri: `${APP_HOST}api/nft/${contract.id}`,
    transferable: data.transferable,
  };

  if (!data.chainId) {
    throw new Error('chainId is undefined');
  }

  const alphaDeployer = constants.blockchain[data.chainId].alphaDeployerContract;
  if (!alphaDeployer) throw new Error('alphaDeployer is undefined');

  const messageHash = await getHashFromDeployer(alphaDeployer, data.chainId, hashBody);
  const signer = await web3.eth.accounts.privateKeyToAccount(CONTRACT_PRIVATE_KEY);

  const signature = await signer.sign(messageHash).signature;

  return {
    userId_: investorId,
    collectionId_: contract.id,
    name_: data.name,
    symbol_: data.symbol,
    baseUri_: `${APP_HOST}api/nft/${contract.id}`,
    transferable_: data.transferable,
    signature_: signature,
  };
};

export const insertTokenContract = async (investorId: number, dtoData: CreateTokenContractDto) => {
  const data: Partial<Contract> = {
    investorId,
    chainId: dtoData.chainId,
    address: dtoData.address,
    name: dtoData.name,
    symbol: dtoData.symbol,
    isVerified: true,
    standard: TokenStandardDto.ERC20,
    type: TokenType.Token,
  };

  const existedTokens = await contractModel.getByConditions({
    investorId,
    address: data.address,
    chainId: data.chainId,
  });

  if (existedTokens.length) {
    throw new ConflictError(ConflictErrorKeys.TokenAlreadyExists);
  }

  const decimals = await getDecimals(dtoData.address, dtoData.chainId);
  data.decimals = decimals;

  try {
    if (!data.name) {
      const name = await getName(dtoData.address, dtoData.chainId);

      data.name = name;
    }
    if (!data.symbol) {
      const symbol = await getSymbol(dtoData.address, dtoData.chainId);
      data.symbol = symbol;
    }
  } catch (error) {
    throw new BadRequestError(BadRequestErrorKeys.CannotFetchTokenNameAndSymbol);
  }

  const contract = await contractModel.create(data);

  return contract as Contract;
};
