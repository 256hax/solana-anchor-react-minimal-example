## Overview
Create an nft then verify collection.

## Run
### Preare
1. Run 1_create_and_mint_nft_with_collection
2. Check Collection Mint Address

### Mint
```
% sugar launch
? Do you want to continue without automatically setting the candy machine collection? (y/n) › y

% sugar collection set <COLLECTION_MINT>
% sugar mint
```

### Verify(Sign) NFT for Creator
Collection NFT has verified by Sugar but Edition NFT hasn't verified yet.

Metaboss verify(Sign) command: ```metaboss sign one --keypair <PATH_TO_KEYPAIR> --account <MINT_ACCOUNT>```

```
% metaboss sign one --keypair ~/.config/solana/id.json --account 5pZHC5sUKj5w5d36ahNnqnsnNVSRK1eejvgMmPAaenJE
```

## Another way
If you have minted already, try following.
[Metaboss - Collections](https://solana.fm/address/CJ2EqdKNhiBAXzeRL5ujHk5G8jZJabjU3kzGkGUCv3jL/metadata)

## Reference
[Metaplex Docs - collection](https://docs.metaplex.com/developer-tools/sugar/reference/commands#collection)