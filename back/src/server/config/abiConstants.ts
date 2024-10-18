export { erc721Abi, erc20Abi, alphaCollectionAbi, alphaDeployerAbi, alphaTreasuryAbi };

const erc721Abi = [
  {
    constant: true,
    inputs: [
      {
        name: 'who',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const erc20Abi = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'who',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

const alphaCollectionAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'receiver_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'quantity_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce_',
        type: 'uint256',
      },
    ],
    name: 'getMessageHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const alphaDeployerAbi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'userId_',
        type: 'uint256',
      },
    ],
    name: 'getCreatorCollections',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'collectionId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'collectionAddress',
            type: 'address',
          },
        ],
        internalType: 'struct AlphaDeployer.Collection[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'userId_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'collectionId_',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'baseUri_',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'transferable_',
        type: 'bool',
      },
    ],
    name: 'getMessageHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const alphaTreasuryAbi = [
  {
    inputs: [
      {
        internalType: 'uint256[]',
        name: 'rewardIds_',
        type: 'uint256[]',
      },
    ],
    name: 'getRewardStatuses',
    outputs: [
      {
        internalType: 'bool[]',
        name: '',
        type: 'bool[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'questId_', type: 'uint256' },
      { internalType: 'address', name: 'token_', type: 'address' },
    ],
    name: 'getQuestERC20Rewards',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'questId_', type: 'uint256' },
      { internalType: 'address', name: 'token_', type: 'address' },
    ],
    name: 'getQuestERC721Rewards',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'questId_', type: 'uint256' },
      { internalType: 'address', name: 'token_', type: 'address' },
    ],
    name: 'getQuestERC1155Rewards',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        internalType: 'struct AlphaTreasury.ERC1155Reward[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token_', type: 'address' },
      { internalType: 'uint256', name: 'amount_', type: 'uint256' },
    ],
    name: 'getERC20Hash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token_', type: 'address' },
      { internalType: 'uint256[]', name: 'tokenIds_', type: 'uint256[]' },
    ],
    name: 'getERC721Hash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'token_', type: 'address' },
      { internalType: 'uint256[]', name: 'tokenIds_', type: 'uint256[]' },
      {
        internalType: 'uint256[]',
        name: 'tokenAmounts_',
        type: 'uint256[]',
      },
    ],
    name: 'getERC1155Hash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'uint256', name: 'questId_', type: 'uint256' },
      { internalType: 'uint256', name: 'rewardId_', type: 'uint256' },
      { internalType: 'uint256', name: 'userId_', type: 'uint256' },
      { internalType: 'bytes32', name: 'rewardHash_', type: 'bytes32' },
    ],
    name: 'getClaimHash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'questId_', type: 'uint256' },
      { internalType: 'uint256', name: 'rewardId_', type: 'uint256' },
      { internalType: 'uint256', name: 'userId_', type: 'uint256' },
    ],
    name: 'getClaimingStatus',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'questId_', type: 'uint256' },
      {
        internalType: 'uint256[]',
        name: 'rewardIds_',
        type: 'uint256[]',
      },
      { internalType: 'bytes32', name: 'rewardHash_', type: 'bytes32' },
    ],
    name: 'getAdditionHash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
];
