# Metadata and Metadata Pointer Extension

## Docs
- [Metadata and Metadata Pointer Extension](https://solana.com/developers/courses/token-extensions/token-extensions-metadata)
- [GitHub - solana-lab-token22-metadata](https://github.com/Unboxed-Software/solana-lab-token22-metadata.git)

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
Token URI: https://gateway.irys.xyz/DXJBT4AKDmqetDPyTjqqZsLdm8Ar1b1ZEXtHNMDKoUGP
Associate Token Account =====> {
  address: PublicKey [PublicKey(AjmEcAdig2HcyfeDrSpgrtqecHdkucoP4mapjXJtK3D5)] {
    _bn: <BN: 90ad97b013de1ec1c9994df737f5be4436f2ab47cf4188d18a784e8916120324>
  },
  mint: PublicKey [PublicKey(3hoZdwMSPW6xiHwVkZaqEA6iJs5c2HEC1tYjf4dgi2Ly)] {
    _bn: <BN: 282b413cc08676e7b44d6ff1cfc6ac513c2c041f4ca8e80731fd55fca6fef7c2>
  },
  owner: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  amount: 1n,
  delegate: null,
  delegatedAmount: 0n,
  isInitialized: true,
  isFrozen: false,
  isNative: false,
  rentExemptReserve: null,
  closeAuthority: null,
  tlvData: <Buffer 07 00 00 00>
}
Mint =====> {
  address: PublicKey [PublicKey(3hoZdwMSPW6xiHwVkZaqEA6iJs5c2HEC1tYjf4dgi2Ly)] {
    _bn: <BN: 282b413cc08676e7b44d6ff1cfc6ac513c2c041f4ca8e80731fd55fca6fef7c2>
  },
  mintAuthority: null,
  supply: 1n,
  decimals: 0,
  isInitialized: true,
  freezeAuthority: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  tlvData: <Buffer 12 00 40 00 f5 a4 4a 6f 36 83 96 11 71 1f 04 14 9f 51 dd 40 6d d4 bc 52 cb 86 f2 0d d2 b1 16 08 a6 2c 7e e9 28 2b 41 3c c0 86 76 e7 b4 4d 6f f1 cf c6 ... 181 more bytes>
}
onchain metadata =====> {
  updateAuthority: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  mint: PublicKey [PublicKey(3hoZdwMSPW6xiHwVkZaqEA6iJs5c2HEC1tYjf4dgi2Ly)] {
    _bn: <BN: 282b413cc08676e7b44d6ff1cfc6ac513c2c041f4ca8e80731fd55fca6fef7c2>
  },
  name: 'Cat NFT',
  symbol: 'EMB',
  uri: 'https://gateway.irys.xyz/DXJBT4AKDmqetDPyTjqqZsLdm8Ar1b1ZEXtHNMDKoUGP',
  additionalMetadata: []
}
Mint offchain metadata =====> {
  name: 'Cat NFT',
  symbol: 'EMB',
  description: 'This is a cat',
  external_url: 'https://solana.com/',
  image: 'https://gateway.irys.xyz/CN5Pm3Fwx8D2T215HKouB8jaERXrFQhm9kpD9iBLVB5d',
  attributes: [
    { trait_type: 'species', value: 'Cat' },
    { trait_type: 'breed', value: 'Cool' }
  ]
}
```