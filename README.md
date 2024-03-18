# Solana x Anchor x React Minimal Example
Solana, Anchor, Metaplex, React Minimal Example.  
This is Out of the Box, easy to start!  
I wrote the code in a single file to make it easy to understand, without dividing it into modules.

For experiment purposes only.  

## How To Run
It depends on Framework (e.g. Anchor, React, JS...). Check README.md in each directory.

## Wallet Key
I set id.json(keypair of wallet) at each directory.  
Feel free to use that for only Devnet/Testnet. I hope you can easy to start minimal examples.

## Tools
### User-friendly Transaction Explorer
I recommend to use Solana Explorer for localnet.

1. Run local validator.
```
% solana-test-validator
```

2. Deploy something to localnet.

3. Search Transaction Signature or public-key in Solana Explorer.
[Solana Explorer (localhost:8899)](https://explorer.solana.com/?cluster=custom)

### Use Metaplex in Localnet
You can use Metaplex(e.g. mint/update NFTs) in Localnet.  

#### Case 1 Anchor:  
[Mint NFT using Metaplex and Anchor in Localnet](https://github.com/256hax/solana-anchor-react-minimal-example/tree/main/anchor/mint_nft_using_metaplex_anchor_in_localnet)  

#### Case 2 Solana CLI:  
```
% solana-test-validator --url https://api.devnet.solana.com /
	--clone metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s /
	--clone PwDiXFxQsGra4sFFTT8r1QWRMd4vfumiWC1jfWNfdYT /
	--clone H7h6dv6X9KGLuCFvYMNa1zmCP5VCSzw8AkQGod6zaCnX /
	--clone ojLGErfqghuAqpJXE1dguXF7kKfvketCEeah8ig6GU3
```

Remove test-ledger directory if it exists before running.
  
#### Case 3 Metaplex Amman:  
[2/ Just add any program you need to the validator config and get back to building!](https://x.com/metaplex/status/1756731772224909638?s=20)

## Outline Document for Product/Project Manager
[Solana Blockchain Outline Figure](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/Solana_Blockchain_Outline_Figure.pptx)

### Example Image
![STEPN ON/OFF Chain](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/stepn-screenshot.png?raw=true)  

![STEPN Mapping System](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/stepn-mapping-system.png?raw=true)  

![Magic Eden Escrow](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/magiceden-accounts.png?raw=true)

# Reference
## Solana
- [Docs - Solana Cookbook](https://solanacookbook.com/)
- [Docs - Solana CLI(e.g. Create Account, Transfer SOL)](https://docs.solana.com/cli)
- [Docs - SPL Token CLI(e.g. Create Token/ATA, Mint, Transfer))](https://spl.solana.com/token)
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

## NFT/Compressed NFT
- Reference links move to [metaplex](https://github.com/256hax/solana-anchor-react-minimal-example/tree/main/scripts/metaplex)
- [Support - Discord Metaplex](https://discord.com/invite/metaplex)

## Wallet Adapter for dApps
- [Docs - Phantom](https://docs.phantom.app/)
- [GitHub - anza-xyz/wallet-adapter](https://github.com/anza-xyz/wallet-adapter)

## Wallet App
- [API - (JS)Wallet Standard](https://wallet-standard.github.io/wallet-standard/)
- [GitHub - wallet-standard/wallet-standard](https://github.com/wallet-standard/wallet-standard)
- [GitHub - anza-xyz/wallet-standard](https://github.com/anza-xyz/wallet-standard)

## Arweave
- [Docs - Arweave Developers](https://docs.arweave.org/developers/)
- [GraphQL - Arweave](https://arweave.net/graphql)
- [GitHub - arweave-js](https://github.com/ArweaveTeam/arweave-js)
- [GitHub - arlocal](https://github.com/textury/arlocal)
- [GitHub - ArConnect](https://github.com/th8ta/ArConnect)
- [Support - Discord Arweave](https://discord.com/invite/BXk8tq7)
