# AlphaGuilty

### Migrations:

```
npm run typeorm -- migration:generate -n 'init'
npm run typeorm -- migration:run
npm run typeorm -- migration:revert
```

## For admin

for start application use this:
`npm run admin:dev`

for developing use this
`npm run admin:debug`

just generate swagger dock
`npm run admin:docs`

## For server

for start or developing application use this:
`npm run start:dev`

## How to run tests:

create test database with same connection options

```
npm run test // run all tests
npm run test admin/project // run specific test test/endpoints/admin/project.test.ts
```

## How to mint ERC20/ERC721 tokens to your wallet

Follow the link with the video description, any one with @alphaguilty.io email can access it
https://drive.google.com/file/d/15lXgdUsupnOdTnOSFfCd34D9Ff2fU_ii/view?usp=sharing

```
// 0xBFe07D56f78874aCfbc28817c2D14cC4AF0db920 (token address)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SimpleNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("SimpleNFT", "SNFT") {}

    function safeMint(address to) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }
}
```

Add ERC20 token just like in the video description [here](https://drive.google.com/file/d/15lXgdUsupnOdTnOSFfCd34D9Ff2fU_ii/view?usp=sharing)
And call the CLAIM method with the certain number(that's how many tokens you'll get)

```
// 0x566Faa6B9492d0312418Ea10619415eaC6ad64DA (token address)
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract EighteenDecimalsToken is ERC20 {
    constructor (string memory name, string memory symbol) ERC20(name, symbol) {}

    function claim(uint allocation) public {
        _mint(msg.sender, allocation);
        _approve(msg.sender, msg.sender, allocation);
    }

    function decimals() public view virtual override returns (uint8) {
        return 9;
    }
    
}
```

## How to add a new chain to handle on-chain tasks?

Follow the link with the video description, any one with @alphaguilty.io email can access it

## Wallet for testing purposes:

Wallet adress: 0xaE4C5792BA12c6dcDae6e072cDea92eBFf7616D0

Wallet provided above contains 
- ~0.25 Goerli ETH, native token
- 505 ALPHATEST ERC20 tokens, address: 0x1a4f8db9c94e1b64381637d759492e3cf3ca5a0b
- 3 Simple NFT ERC721 tokens, address: 0x32d346f28b1b193b5addd6d6c2e399b7623f5b9d

Bellow is the key to access test wallet(0xaE4C5792BA12c6dcDae6e072cDea92eBFf7616D0) in case it will be needed

```
giggle
lumber
govern
congress
since
weapon
pattern
fashion
rebuild
chase
dune
glance
```

## Experience system task types:

'connectTelegram',
'connectTwitter',
'connectDiscord',
'connectWallet',
'registerWithTwitter',
'registerWithDiscord',
'registerWithGoogle',
'registerWithEmail',
'registerWithPhone',
'registerWithWallet',
'connect2fa',
'completeFirstTask',
'completeAllTasks',
'winScoreboardQuest',
'winLuckyDrawQuest',
'winGuaranteedQuest',