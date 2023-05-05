## Overview
Mint NFTs using Metaplex Candy Machine v3 Sugar(CLI).

## Run
```
% sugar launch
% sugar guard add
```

Get Candy Machine and Sugar Guards setting.

```
% sugar show
[1/1] 🔍 Looking up candy machine

🍬 Candy machine ID: 8dGEZcErCAmiJqJCoMmcruaG6EjujFcE4GtFaGoYaB5o
 :
 :.. authority: HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
 :.. mint authority: KhDnv6KaWaxFVQoP3RTkqBKnTFDLtTnWroXzWYW7pru
 :.. collection mint: 8ehuTEJraaZiVpTNYzY22Y9ptf9J7CnBJoh1dob3Vqcp
 :.. account version: V2
 :.. token standard: NonFungible
 :.. features: none
 :.. max supply: 0
 :.. items redeemed: 0
 :.. items available: 2
 :.. symbol: NB
 :.. seller fee basis points: 5% (500)
 :.. is mutable: true
 :.. creators:
 :   :.. 1: HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg (100%)
 :.. hidden settings: none
 :.. config line settings:
     :.. prefix_name: Number #000
     :.. name_length: 1
     :.. prefix_uri: https://arweave.net/
     :.. uri_length: 43
     :.. is_sequential: false

✅ Command successful.
```

```
% sugar guard show
[1/1] 🔍 Loading candy guard
▪▪▪▪▪ Done

🛡  Candy Guard ID: KhDnv6KaWaxFVQoP3RTkqBKnTFDLtTnWroXzWYW7pru
 :
 :.. base: 2JFsmuQqXwiEstPNe3Y1Lv4yTqtyCFUzw7KURN59ucHr
 :.. bump: 254
 :.. authority: HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
 :.. data:
     :.. default:
     :   :.. bot tax: none
     :   :.. sol payment:
     :   :   :.. lamports: 1230000 (◎ 0.00123)
     :   :   :.. destination: HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
     :   :.. token payment: none
     :   :.. start date:
     :   :   :.. date: Sun October 23 2022 20:00:00 UTC
     :   :.. third party signer: none
     :   :.. token gate: none
     :   :.. gatekeeper: none
     :   :.. end date: none
     :   :.. allow list: none
     :   :.. mint limit:
     :   :   :.. id: 1
     :   :   :.. amount: 1
     :   :.. nft payment: none
     :   :.. redeemed amount:
     :   :   :.. amount: 8
     :   :.. address gate: none
     :   :.. nft gate: none
     :   :.. nft burn: none
     :   :.. token burn: none
     :   :.. freeze sol payment: none
     :   :.. freeze token payment: none
     :.. groups: none

✅ Command successful.
```

## Get Mint Address
You need to get Mint Address in latest transaction.

## Reference
- [Sugar for Candy Machine V3 Configuration](https://docs.metaplex.com/developer-tools/sugar/guides/sugar-for-cmv3)