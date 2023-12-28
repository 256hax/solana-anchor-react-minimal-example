## Overview
Mint NFTs using Metaplex Candy Machine v3 Sugar(CLI).

## HowTo
### Setup
```
% solana config set --url devnet
```

### Run
It's depends on case(e.g. with guards or no guards...). Look at each diretory.

### Re-Run
Delete cache.json then continue sugar command.

## Note
### Mint Standard NFT without Collection Upload
Mint one Collection NFT and get Mint Address.  

Then, use `deploy --collection-mint`. (It dosen't work `collection set`)

```
% sugar validate
% sugar upload
% sugar deploy --collection-mint <COLLECTION MINT ADDRESS>
% sugar mint
```

## Reference
- [Sugar](https://docs.metaplex.com/programs/candy-machine/how-to-guides/my-first-candy-machine-part1)