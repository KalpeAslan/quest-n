export enum Networks {
  Ethereum = '0x1',
  Polygon = '0x89',
  BNB = '0x38',
  Avalanche = '0xa86a',
  Arbitrum = '0xa4b1',
  Optimism = '0xa',
  KCC = '0x141',
  Goerli = '0x5',
  Bitgert = '0x7f08',
  ZetaTestnet = '0x1b59',
  GoerliArbitrum = '0x66eed',
  Aurora = '0x4e454152',
}

export type NFTTypes = 'ERC721' | 'ERC1155';

export interface IEtherscanTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasPriceBid: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}
