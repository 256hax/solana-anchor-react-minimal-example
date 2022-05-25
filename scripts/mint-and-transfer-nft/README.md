# Mint and Transfer NFT Example
## Overview
This example running 4 steps.

1. Upload image to Arweave.
2. Upload Metadata to Arweave.
3. Mint NFT on Solana.
4. Transfer NFT to someone on Solana.

## Setup
```
% npm install
```

Token Faucet
```
% ts-node src/misc/helpers/arweaveAirdrop.ts
% ts-node src/misc/helpers/solanaAirdrop.ts
```

## Run
```
% npm test
```

## Note
If you've got error about Arweave, change Arweave cluster.  
"www.arweave.run" cluster doesn't work sometimes.  
"testnet.redstone.tools"(Powered by RedStone Finance) is better for use.
