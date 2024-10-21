# Metadata Pointer Extension without Metaplex

## Docs
- [How to use the Metadata Pointer extension](https://solana.com/developers/guides/token-extensions/metadata-pointer)

## Setup
```
% npm i
% cp .env.example .env
```

## Run
```
% npm run start
```

## Execution Log Example
```
Create Mint Account: https://solana.fm/tx/4JJtgBq9oN1xzNjXSww65S7w8gg4qFabaJcfLZrqHsseje4ceXFmr7d1rFEmbaYRYw7VVaM2hY3HfYRhQoL6SR3Q?cluster=devnet-solana

Metadata Pointer: {
  "authority": "HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg",
  "metadataAddress": "Dp4DaUN45qGc6VEGuA9zNCYSXB8y9Zn2WcUmirTu7bAe"
}

Metadata: {
  "updateAuthority": "HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg",
  "mint": "Dp4DaUN45qGc6VEGuA9zNCYSXB8y9Zn2WcUmirTu7bAe",
  "name": "OPOS",
  "symbol": "OPOS",
  "uri": "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
  "additionalMetadata": [
    [
      "description",
      "Only Possible On Solana"
    ]
  ]
}

Remove Additional Metadata Field: https://solana.fm/tx/59mreq8nBhKwVZNWJYeFZL6tQJ5RKn88sSmqLDnCjMjm11wFVKco3ePRRh9ejgXvv4tBuLp8oEkseTpXq9e3puYY?cluster=devnet-solana

Updated Metadata: {
  "updateAuthority": "HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg",
  "mint": "Dp4DaUN45qGc6VEGuA9zNCYSXB8y9Zn2WcUmirTu7bAe",
  "name": "OPOS",
  "symbol": "OPOS",
  "uri": "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
  "additionalMetadata": []
}

Mint Account: https://solana.fm/address/Dp4DaUN45qGc6VEGuA9zNCYSXB8y9Zn2WcUmirTu7bAe?cluster=devnet-solana
```