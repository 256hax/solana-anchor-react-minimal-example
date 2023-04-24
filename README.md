# Solana x Anchor x React Minimal Example
Solana x Anchor x React Minimal Example. And there are a few contents(Metaplex, Arweave JS and Outline Document).  
For experiment purpose only.

## How To Run
It's depends on Framework(e.g. Anchor, React, JS...). Check README.md at each directories.

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

### Use Metaplex and Anchor in Localnet
You can use Metaplex(e.g. mint/update NFTs) in Localnet.
[Mint NFT using Metaplex and Anchor in Localnet](https://github.com/256hax/solana-anchor-react-minimal-example/tree/main/anchor/mint_nft_using_metaplex_anchor_in_localnet)

## Outline Document for Product/Project Manager
[Solana Blockchain Outline Figure](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/Solana_Blockchain_Outline_Figure.pptx)

### Example Image
![STEPN ON/OFF Chain](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/stepn-screenshot.png?raw=true)  

![STEPN Mapping System](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/stepn-mapping-system.png?raw=true)  

![Magic Eden Escrow](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/magiceden-accounts.png?raw=true)

# Reference
## Solana
- [Docs - Solana Cookbook](https://solanacookbook.com/)
- [Docs - Solana Errors List](https://github.com/solana-labs/solana/blob/master/sdk/src/transaction/error.rs)
- [API - (Rust)solana_program](https://docs.rs/solana-program/latest/solana_program/)
- [API - (Rust)solana_sdk](https://docs.rs/solana-sdk/latest/solana_sdk/)
- [API - (Rust)spl_token](https://docs.rs/spl-token/latest/spl_token/)
- [API - (JS)@solana/web3.js](https://solana-labs.github.io/solana-web3.js/modules.html)
- [API - (JS)@solana/spl-token](https://solana-labs.github.io/solana-program-library/token/js/)
- [GitHub - solana-labs/solana-program-library](https://github.com/solana-labs/solana-program-library)
- [GitHub - SPL Token Rust](https://github.com/solana-labs/solana-program-library/blob/master/token/program/src/instruction.rs)
- [GitHub - SPL Token JavaScript](https://github.com/solana-labs/solana-program-library/tree/master/token/js/src/actions)
- [GitHub -  solana-developers/program-examples](https://github.com/solana-developers/program-examples)
- [Support - Discord Solana](https://discord.com/invite/kBbATFA7PW)
- [Support - Stack Exchange Solana](https://solana.stackexchange.com/)

## Solana Pay
- [GitHub - solana-pay-minimal-example - 256hax](https://github.com/256hax/solana-pay-minimal-example)

## Anchor
- [Docs - Anchor(Installation, Core Concept, Guides, References)](https://www.anchor-lang.com/)
- [Docs - The Anchor Book](https://book.anchor-lang.com/)
- [Docs - Anchor Errors List](https://anchor.so/errors)
- [API - (Rust)anchor_lang](https://docs.rs/anchor-lang/latest/anchor_lang/)
- [API - (Rust)anchor_spl](https://docs.rs/anchor-spl/latest/anchor_spl/index.html)
- [API - (JS)@coral-xyz/anchor](https://coral-xyz.github.io/anchor/ts/index.html)
- [GitHub - anchor](https://github.com/coral-xyz/anchor)
- [Support - Discord Anchor](https://discord.com/invite/ZCHmqvXgDw)

## Metaplex/NFT
- [Docs - Account Structure(Mint Account, Metadata Account)](https://docs.metaplex.com/programs/token-metadata/accounts)
- [Docs - Token Standard(Data Structure)](https://docs.metaplex.com/programs/token-metadata/token-standard)
- [Docs - Candy Machine(Umi)](https://docs.metaplex.com/programs/candy-machine/overview)
- [Docs - Sugar(CLI)](https://docs.metaplex.com/developer-tools/sugar/)
- [Docs - Metaboss(CLI)](https://metaboss.rs/)
- [API - (Rust)mpl_token_metadata](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/all.html)
- [API - (Rust)metaboss_lib](https://docs.rs/metaboss_lib/latest/metaboss_lib/)
- [API - (JS)@metaplex-foundation/mpl-token-metadata](https://metaplex-foundation.github.io/metaplex-program-library/docs/token-metadata/index.html)
- [API - (JS)@metaplex-foundation/js](https://metaplex-foundation.github.io/js/modules/js.html)
- [API - (JS)@metaplex-foundation/mpl-candy-machine](https://mpl-candy-machine-js-docs.vercel.app/)
- [GitHub - Metaplex JavaScript SDK](https://github.com/metaplex-foundation/js)
- [GitHub - Metaplex JS SDK Examples(CRA, Vite, Next, Express)](https://github.com/metaplex-foundation/js-examples)
- [GitHub - Umi](https://github.com/metaplex-foundation/umi)
- [GitHub - Sugar](https://github.com/metaplex-foundation/sugar)
- [Support - Discord Metaplex](https://discord.com/invite/metaplex)
- [Tools - Collection NFT Web Tool](https://docs.metaplex.com/programs/token-metadata/certified-collections#set-and-verify-a-collection-using-collectionsmetaplexcom)

## State Compression / Compressed NFT
- [Docs - News](https://solana.com/news/how-to-use-compressed-nfts-on-solana?ref=solana.ghost.io)
- [Docs - Concept: State Compression](https://edge.docs.solana.com/learn/state-compression)
- [Docs - Guide: Creating Compressed NFTs with JavaScript](https://edge.docs.solana.com/developing/guides/compressed-nfts)
- [GitHub - Example Code](https://github.com/solana-developers/compressed-nfts)
- [GitHub - Metaplex Digital Asset RPC](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)

## Wallet Adapter for DApps
- [Docs - Phantom](https://docs.phantom.app/)
- [API - (JS)@solana/wallet-adapter](https://solana-labs.github.io/wallet-adapter/)
- [GitHub - solana-labs/wallet-adapter](https://github.com/solana-labs/wallet-adapter)

## Wallet App
- [API - (JS)Wallet Standard](https://wallet-standard.github.io/wallet-standard/)
- [GitHub - wallet-standard/wallet-standard](https://github.com/wallet-standard/wallet-standard)
- [GitHub - solana-labs/wallet-standard](https://github.com/solana-labs/wallet-standard)

## Arweave
- [Docs - Arweave Developers](https://docs.arweave.org/developers/)
- [GraphQL - Arweave](https://arweave.net/graphql)
- [GitHub - arweave-js](https://github.com/ArweaveTeam/arweave-js)
- [GitHub - arlocal](https://github.com/textury/arlocal)
- [GitHub - ArConnect](https://github.com/th8ta/ArConnect)
- [Support - Discord Arweave](https://discord.com/invite/BXk8tq7)
