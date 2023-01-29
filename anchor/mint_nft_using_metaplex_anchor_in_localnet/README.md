# Mint NFT using Metaplex and Anchor in Localnet
## Overview
You can mint NFT in localnet.  
Clone Metaplex program from Devnet then, deploy to Anchor local validator.  
Look at see Anchor.toml.  

## Data
- NFT Account: Localnet
- NFT Image: Arweave(Mainnnet)

## Run
```
% npm i
% anchor test

  myanc
uri => https://arweave.net/iVzWYtALm7a59JSSyIWH0Out7aSa2DFqNbxLix-kRT4
nft.address => E1doyo91tZaMgnHaFyntY5mkTKpDZt2NMAoPcDh4nEU5
nft => {
  model: 'nft',
  updateAuthorityAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
    _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
  },
  json: {
    name: 'My NFT Metadata',
    description: 'My description',
    image: 'https://placekitten.com/20/30'
  },
  jsonLoaded: true,
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/iVzWYtALm7a59JSSyIWH0Out7aSa2DFqNbxLix-kRT4',
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 500,
  editionNonce: 255,
  creators: [
    {
      address: [PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)]],
      verified: true,
      share: 100
    }
  ],
  tokenStandard: 0,
  collection: null,
  collectionDetails: null,
  uses: null,
  address: PublicKey [PublicKey(E1doyo91tZaMgnHaFyntY5mkTKpDZt2NMAoPcDh4nEU5)] {
    _bn: <BN: c1518d1d3ba2f03957eaa42c32b3b3e4dcfdfc5a3834556623ab9fbb2e8082ae>
  },
  metadataAddress: Pda [PublicKey(E9a5jcTDvRpi4x9bFrJKryMSp5yB156tQ3T8UiLgKVAX)] {
    _bn: <BN: c359fb66b8604cbb3095c986d990e733c372c37bbd0e8e8dd476988c982a77f8>,
    bump: 255
  },
  mint: {
    model: 'mint',
    address: PublicKey [PublicKey(E1doyo91tZaMgnHaFyntY5mkTKpDZt2NMAoPcDh4nEU5)] {
      _bn: <BN: c1518d1d3ba2f03957eaa42c32b3b3e4dcfdfc5a3834556623ab9fbb2e8082ae>
    },
    mintAuthorityAddress: PublicKey [PublicKey(4TGdUXhkFNPhyVYLAbi8vsnuSAeHVrrY2gahYRD7NU9g)] {
      _bn: <BN: 334dd55c356c46987db55e6be717ca43ea5ffcfe7c24798c51f5cff809618d6b>
    },
    freezeAuthorityAddress: PublicKey [PublicKey(4TGdUXhkFNPhyVYLAbi8vsnuSAeHVrrY2gahYRD7NU9g)] {
      _bn: <BN: 334dd55c356c46987db55e6be717ca43ea5ffcfe7c24798c51f5cff809618d6b>
    },
    decimals: 0,
    supply: { basisPoints: <BN: 1>, currency: [Object] },
    isWrappedSol: false,
    currency: { symbol: 'Token', decimals: 0, namespace: 'spl-token' }
  },
  token: {
    model: 'token',
    address: Pda [PublicKey(54MuTE4mjAQpFuJv5FptAKCZtSKbevVsoVaYoLdLv772)] {
      _bn: <BN: 3c4b2072efd95183edafa5e97944140e0b638507838f114c4d8858d89886afed>,
      bump: 255
    },
    isAssociatedToken: true,
    mintAddress: PublicKey [PublicKey(E1doyo91tZaMgnHaFyntY5mkTKpDZt2NMAoPcDh4nEU5)] {
      _bn: <BN: c1518d1d3ba2f03957eaa42c32b3b3e4dcfdfc5a3834556623ab9fbb2e8082ae>
    },
    ownerAddress: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    amount: { basisPoints: <BN: 1>, currency: [Object] },
    closeAuthorityAddress: null,
    delegateAddress: null,
    delegateAmount: { basisPoints: <BN: 0>, currency: [Object] },
    state: 1
  },
  edition: {
    model: 'nftEdition',
    isOriginal: true,
    address: Pda [PublicKey(4TGdUXhkFNPhyVYLAbi8vsnuSAeHVrrY2gahYRD7NU9g)] {
      _bn: <BN: 334dd55c356c46987db55e6be717ca43ea5ffcfe7c24798c51f5cff809618d6b>,
      bump: 255
    },
    supply: <BN: 0>,
    maxSupply: <BN: 1>
  }
}
    ✔ Mint NFT (14555ms)


  1 passing (15s)

✨  Done in 16.28s.
```

## Find Explorer in Localnet
```
% anchor test
% cd .anchor
% solana-test-validator
```

Find mint addres for [Solana Explorer Localnet](https://explorer.solana.com/?cluster=custom) .

## Reference
- [The Anchor Book - Anchor.toml Reference](https://book.anchor-lang.com/anchor_references/anchor-toml_reference.html)
- [Metaplex create() fails on localhost with: Attempt to load a program that does not exist](https://solana.stackexchange.com/questions/1879/metaplex-create-fails-on-localhost-with-attempt-to-load-a-program-that-does-n/1887)