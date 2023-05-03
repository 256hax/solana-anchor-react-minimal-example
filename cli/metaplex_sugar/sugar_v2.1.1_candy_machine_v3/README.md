## Overview
Mint NFTs using Metaplex Candy Machine v3 Sugar(CLI).

## Run
### Setup
```
% solana config set --url devnet
% sugar launch
```

### Mint NFTs
Mint #1
```
% sugar mint
```

Mint #2
```
% sugar mint
```

### Get Mint Address
Look at latest tx using Candy Machine ID to see the Mint.  
e.g. [21Dgokyh5LJVBr41FLWqX4635VmxdoQsHRNWwXo3eNtw](https://solana.fm/tx/3aL7WEFXbRK3o4EuEioiRYmGw4MRA8CzPVgMdXTzks4yR8PDPgBJNg21MFzkvSSAfvMAvpK4JznENre1LzD931gi?cluster=devnet-qn1)
```
% sugar verify

...

Verification successful. You're good to go!

See your candy machine at:
  -> https://www.solaneyes.com/address/21Dgokyh5LJVBr41FLWqX4635VmxdoQsHRNWwXo3eNtw?cluster=devnet
```

### Verify(Sign) Creator
`metaboss sign one --keypair <PATH_TO_KEYPAIR> --account <MINT_ADDRESS>`
```
% metaboss sign one --keypair ~/.config/solana/id.json --account 2xUxNaiVAd1xTeFnEMLqBqCAukAeUS97tkWE2VrF6Nt6
```

## Mint Standard NFT without Collection Upload
Set assets without collection.

```
% sugar config create
% sugar validate
% sugar upload
```

Add collection information obtained from deployed cache.json to new cache.json, as follows:

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
Use `deploy --collection-mint`. Dosn't work `collection set`.

```
% sugar validate
% sugar upload
% sugar deploy --collection-mint <COLLECTION MINT ADDRESS>
% sugar mint
```

## Reference
- [Sugar](https://docs.metaplex.com/programs/candy-machine/how-to-guides/my-first-candy-machine-part1)
- [Sugar for Candy Machine V3 Configuration](https://docs.metaplex.com/developer-tools/sugar/guides/sugar-for-cmv3)