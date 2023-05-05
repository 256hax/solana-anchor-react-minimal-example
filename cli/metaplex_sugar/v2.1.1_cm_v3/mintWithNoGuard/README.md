## Overview
Mint NFTs using Metaplex Candy Machine v3 Sugar(CLI).

## Run
Note: Mint one NFT per hit `sugar mint` command.

```
% sugar launch
% sugar mint
% sugar mint
```

## Get Mint Address
You need to get Mint Address in latest transaction.

## Verify(Sign) Creator
Use Metaboss(CLI).

`metaboss sign one --keypair <PATH_TO_KEYPAIR> --account <MINT_ADDRESS>`
```
% metaboss sign one --keypair ~/.config/solana/id.json --account 2xUxNaiVAd1xTeFnEMLqBqCAukAeUS97tkWE2VrF6Nt6
```

## Reference
- [Sugar](https://docs.metaplex.com/programs/candy-machine/how-to-guides/my-first-candy-machine-part1)