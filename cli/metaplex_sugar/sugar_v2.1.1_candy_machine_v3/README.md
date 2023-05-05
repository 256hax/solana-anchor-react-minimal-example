## Overview
Mint NFTs using Metaplex Candy Machine v3 Sugar(CLI).

## Setup
```
% solana config set --url devnet
```

## Run
It's depends on case(e.g. with guards or no guards...). Look at each diretories.

## Re-Run
Delete cache.json then continue sugar command.

## Mint Standard NFT without Collection Upload
### Prepare Standard NFT.
Upload assets without collection.

```
% sugar config create
% sugar validate
% sugar upload
```

Then, add collection information obtained from deployed cache.json to new cache.json, as follows:

```
{
  "program": {
    ...
    "collectionMint": "JsZGpNgGXwzYKe8xA61mGNcee5tc63egaHBRmQs8nRK"
  },
  "items": {
    "-1": {
      "name": "Numbers Collection",
      "image_hash": "845148a26244b24f37dbaf86270cfe05d28f574c7247383a64c1ad72a130906f",
      "image_link": "https://arweave.net/Zl7-CjuRMsszH-ej6slToD5iQpSGHlI3G0LAKtaqvlw?ext=png",
      "metadata_hash": "78315e014d50212b79be1b35e0107bfcb1bbf808815b926e58b829c92a068787",
      "metadata_link": "https://arweave.net/lBHbIEyOeMsMHTAO_4u6SypPtCI-Imkol7eFMfLB0IM",
      "onChain": true
    }
  },
  ...
}
```

```
% sugar deploy
```

### Mint NFT using existing Collection NFT
Use `deploy --collection-mint`. Dosen't work `collection set`.

```
% sugar validate
% sugar upload
% sugar deploy --collection-mint <COLLECTION MINT ADDRESS>
% sugar mint
```

## Reference
- [Sugar](https://docs.metaplex.com/programs/candy-machine/how-to-guides/my-first-candy-machine-part1)