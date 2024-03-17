# Metaplex Bubblegum (Compressed NFT)
[Metaplex Bubblegum](https://developers.metaplex.com/bubblegum) example codes.

## How can I __?
### How to create Compressed NFT?
STEP1: Create Merkle Tree
STEP2: Create Collection Standard NFT (Standard NFT = Non-compressed)
STEP3: Mint Compressed NFT to Collection

### How can I get Asset ID when I minted cNFT?
Use Parse Leaf function in @metaplex-foundation/mpl-bubblegum.  

- without Collection: parseLeafFromMintV1Transaction
- with Collection: parseLeafFromMintToCollectionV1Transaction

Look at [src folder](https://github.com/256hax/solana-anchor-react-minimal-example/tree/main/scripts/metaplex/bubblegum_CompressedNFT/src).

### How can I identify cNFT?
- Merkle Tree x Leaf Index => Asset ID(cNFT)
- Merkle Tree x cNFT Mint Signatuer => Asset ID(cNFT)

## FAQ
### What's Asset ID?
It's similar Mint Address.

### What's Leaf owner?
It's same as Mint Owner.

### Which should I mint without Collection or with Collectioin?
I recommend mint with Collection. Because it's standard(e.g. Marketplace).

## Setup
```
% cp .env.example .env
```

Then, write your Helius or Shyft API in .env.

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