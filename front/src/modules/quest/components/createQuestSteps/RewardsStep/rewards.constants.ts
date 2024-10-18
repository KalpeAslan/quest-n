export const DEPLOYER_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "userId_", type: "uint256" },
      { internalType: "uint256", name: "collectionId_", type: "uint256" },
      { internalType: "string", name: "name_", type: "string" },
      { internalType: "string", name: "symbol_", type: "string" },
      { internalType: "string", name: "baseUri_", type: "string" },
      { internalType: "bool", name: "transferable_", type: "bool" },
      { internalType: "bytes", name: "signature_", type: "bytes" },
    ],
    name: "deploy",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const TREASURY_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "questId_", type: "uint256" },
      { internalType: "address", name: "token_", type: "address" },
      { internalType: "uint256", name: "quantity_", type: "uint256" },
      {
        internalType: "uint256[]",
        name: "rewardIds_",
        type: "uint256[]",
      },
      { internalType: "uint256", name: "nonce_", type: "uint256" },
      {
        internalType: "bytes",
        name: "collectionSignature_",
        type: "bytes",
      },
      { internalType: "bytes", name: "treasurySignature_", type: "bytes" },
    ],
    name: "mintERC721Reward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "questId_",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "rewardIds_",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "treasurySignature_",
        type: "bytes",
      },
    ],
    name: "addERC20Reward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "questId_", type: "uint256" },
      { internalType: "uint256", name: "rewardId_", type: "uint256" },
      { internalType: "uint256", name: "userId_", type: "uint256" },
      { internalType: "address", name: "token_", type: "address" },
      { internalType: "uint256[]", name: "tokenIds_", type: "uint256[]" },
      {
        internalType: "uint256[]",
        name: "tokenAmounts_",
        type: "uint256[]",
      },
      { internalType: "bytes", name: "signature_", type: "bytes" },
    ],
    name: "claimERC1155Reward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "questId_", type: "uint256" },
      { internalType: "uint256", name: "rewardId_", type: "uint256" },
      { internalType: "uint256", name: "userId_", type: "uint256" },
      { internalType: "address", name: "token_", type: "address" },
      { internalType: "uint256", name: "amount_", type: "uint256" },
      { internalType: "bytes", name: "treasurySignature_", type: "bytes" },
    ],
    name: "claimERC20Reward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "questId_", type: "uint256" },
      { internalType: "uint256", name: "rewardId_", type: "uint256" },
      { internalType: "uint256", name: "userId_", type: "uint256" },
      { internalType: "address", name: "token_", type: "address" },
      { internalType: "uint256[]", name: "tokenIds_", type: "uint256[]" },
      { internalType: "bytes", name: "treasurySignature_", type: "bytes" },
    ],
    name: "claimERC721Reward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "questId_", type: "uint256" },
      { internalType: "uint256", name: "rewardId_", type: "uint256" },
      { internalType: "uint256", name: "userId_", type: "uint256" },
    ],
    name: "getClaimingStatus",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

export const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const EXPERIENCE_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "userId", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "mintProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
