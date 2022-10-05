# Solana x Anchor x React Minimal Example
Solana x Anchor x React Minimal Example. And there are a few contents(Metaplex, Arweave JS and Outline Document).  
For experiment purpose only.

## How To Run
It's depends on Framework(ex: Anchor, React, JS...). Check README.md at each directories.

## Wallet Key
I set id.json(keypair of wallet) at each directories.  
Feel free to use that for only Devnet/Testnet. I hope you can easy to start minimal examples.

## Tools
### User-friendly Transaction Explorer
I recommend to use localnet(localhost) with Transaction Explorer.

1. Run local validator.
```
% solana-test-validator
```

2. Deploy something to localnet.

3. Search Transaction Signature or public-key in Solana Explorer.
[Solana Explorer (localhost:8899)](https://explorer.solana.com/?cluster=custom)

## Outline Document for Product/Project Manager
[Solana Blockchain Outline Figure](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/Solana_Blockchain_Outline_Figure.pptx)

### Example Image
![STEPN ON/OFF Chain](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/stepn-screenshot.png?raw=true)  

![STEPN Mapping System](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/stepn-mapping-system.png?raw=true)  

![Magic Eden Escrow](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/magiceden-accounts.png?raw=true)

# Reference
## Solana
- [Docs - Solana Cookbook](https://solanacookbook.com/)
- [Docs - Phantom](https://docs.phantom.app/)
- [Docs - Solana Errors List](https://github.com/solana-labs/solana/blob/master/sdk/src/transaction/error.rs)
- [Rust - solana_program](https://docs.rs/solana-program/latest/solana_program/)
- [Rust - solana_sdk](https://docs.rs/solana-sdk/latest/solana_sdk/)
- [Rust - spl_token](https://docs.rs/spl-token/latest/spl_token/)
- [API - @solana/web3.js](https://solana-labs.github.io/solana-web3.js/modules.html)
- [API - @solana/spl-token](https://solana-labs.github.io/solana-program-library/token/js/)
- [GitHub - solana-labs/solana-program-library](https://github.com/solana-labs/solana-program-library)
- [GitHub - Latest - SPL Token Rust](https://github.com/solana-labs/solana-program-library/blob/master/token/program/src/instruction.rs)
- [GitHub - Latest - SPL Token JavaScript](https://github.com/solana-labs/solana-program-library/tree/master/token/js/src/actions)
- [GitHub - v0.1.8 - SPL Token Rust](https://github.com/solana-labs/solana-program-library/blob/%40solana/spl-token%40v0.1.8/token/program/src/instruction.rs)
- [GitHub - v0.1.8 - SPL Token JavaScript](https://github.com/solana-labs/solana-program-library/blob/%40solana/spl-token%40v0.1.8/token/js/client/token.js)
- [GitHub - solana-labs/wallet-adapter](https://github.com/solana-labs/wallet-adapter)

## Anchor
- [Docs - Anchor(Installation, Core Concept, Guides, References)](https://www.anchor-lang.com/)
- [Docs - The Anchor Book](https://book.anchor-lang.com/)
- [Docs - Anchor Errors List](https://anchor.so/errors)
- [Rust - anchor_lang](https://docs.rs/anchor-lang/latest/anchor_lang/)
- [Rust - anchor_spl](https://docs.rs/anchor-spl/latest/anchor_spl/index.html)
- [API - @project-serum](https://github.com/project-serum/serum-ts/tree/master/packages)
- [GitHub - anchor](https://github.com/coral-xyz/anchor)

## Metaplex/NFT
- [Docs - Account Structure(Mint Account, Metadata Account)](https://docs.metaplex.com/programs/token-metadata/)
- [Docs - Token Standard(Data Structure)](https://docs.metaplex.com/programs/token-metadata/token-standard)
- [Docs - Candy Machine Errors List](https://docs.metaplex.com/candy-machine-v1/cm-errors)
- [Docs - Metaboss](https://metaboss.rs/)
- [Docs - Project Directory(Rust, SDKs, Tools, UIs, Deprecated)](https://github.com/metaplex-foundation/metaplex)
- [Rust - mpl_token_metadata](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/all.html)
- [Rust - metaboss_lib](https://docs.rs/metaboss_lib/latest/metaboss_lib/)
- [API - @metaplex-foundation/mpl-token-metadata](https://metaplex-foundation.github.io/metaplex-program-library/docs/token-metadata/index.html)
- [GitHub - Metaplex js](https://github.com/metaplex-foundation/js)
- [GitHub - Metaplex Sugar](https://github.com/metaplex-foundation/sugar)
- ~~[GitHub - Metaplex candy-machine.ts](https://github.com/metaplex-foundation/metaplex/blob/master/js/packages/candy-machine-ui/src/candy-machine.ts)~~ Metaplex Sugar is an alternative
- [GitHub - Metaplex js-examples](https://github.com/metaplex-foundation/js-examples)
- [GitHub - Metaplex CMv2 assets example](https://github.com/metaplex-foundation/metaplex/tree/master/js/packages/cli/example-assets)

## Arweave
- [Docs - Arweave Developers](https://docs.arweave.org/developers/)
- [GraphQL - https://arweave.net/graphql](https://arweave.net/graphql)
- [GitHub - arweave-js](https://github.com/ArweaveTeam/arweave-js)
- [GitHub - arlocal](https://github.com/textury/arlocal)
- [GitHub - ArConnect](https://github.com/th8ta/ArConnect)
