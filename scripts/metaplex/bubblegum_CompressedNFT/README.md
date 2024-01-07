# Metaplex Bubblegum (Compressed NFT)
[Metaplex Bubblegum](https://developers.metaplex.com/bubblegum) example codes.

## How to create Compressed NFT?
STEP1: Create Merkle Tree
STEP2: (Option) Create Collection Standard NFT (Standard NFT = Non-compressed)
STEP3: Mint Compressed NFT (to Collection)

## Setup
```
% cp .env.example .env
```

Then, write your Helius API in .env.

## Run
```
% npm i
% ts-node src/<TS_FILE>
```

## Compatible with cNFT
### Explorers
| Explorers | Devnet | Mainnet |
| ---- | ---- | ---- |
| [XRAY](https://xray.helius.xyz/) | ✅ | ✅ |
| [SolanaFM](https://solana.fm/) | N/A | ✅ |
| [Solscan](https://solscan.io/) | N/A | N/A |
| [Shyft Translator](https://translator.shyft.to/) | N/A | N/A |
| [Solana Explorer](https://explorer.solana.com/) | N/A | N/A |
  
as of Jan.7.2024

### RPCs
[Metaplex DAS API RPCs](https://developers.metaplex.com/bubblegum/rpcs)