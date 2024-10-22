# Metadata Pointer Extension without Metaplex

## Docs
- [How to use the Metadata Pointer extension](https://solana.com/developers/guides/token-extensions/metadata-pointer)
- [Use Token Extensions from a Client](https://solana.com/developers/courses/token-extensions/token-extensions-in-the-client)

## Setup
```
% npm i
% cp .env.example .env
```

## Run
```
% solana-test-validator
```
```
% npm run start
```

## Execution Log Example
```
Transaction Signature => 5Pcir77hufWdpyxpidsq65z1xTFvK6Zt7ZVx6r3NwcFF7T12cPnog2DZ9yG1w8Ehw3B1DxgFKhriw1KVqoQA4UwK
Metadata Pointer => {
  "authority": "HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg",
  "metadataAddress": "6jnN1Te7rAnYSG8GdEZJh18a8ojJnSMQu7QoPAVG99Z9"
}
Metadata => {
  "updateAuthority": "HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg",
  "mint": "6jnN1Te7rAnYSG8GdEZJh18a8ojJnSMQu7QoPAVG99Z9",
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
Remove Additional Metadata Field Transaction Signature => Dwx2y2us6fpDG34WdosngdovsU7qEPuqgCUDvg1xsuy8yAPYzoRy4A3kJuZd5z4oRT4d1tYuk2Yoids4P1RbpME
Updated Metadata => {
  "updateAuthority": "HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg",
  "mint": "6jnN1Te7rAnYSG8GdEZJh18a8ojJnSMQu7QoPAVG99Z9",
  "name": "OPOS",
  "symbol": "OPOS",
  "uri": "https://raw.githubusercontent.com/solana-developers/opos-asset/main/assets/DeveloperPortal/metadata.json",
  "additionalMetadata": []
}
Mint Account => 6jnN1Te7rAnYSG8GdEZJh18a8ojJnSMQu7QoPAVG99Z9
Associated Token Account => ATyXkQ5273HN1sr5QSMKqnpBu5RAwX7zyXmN3BpZGKFL
Mint Signature => 5Nm6KuC3VcWZatRvsXbFjTtdDCFixJ95NK1DmSbDvQHxUtEZH75z72Vz2D3RqmxGotTrr74bH62sP3dwCCrcqoXs
```