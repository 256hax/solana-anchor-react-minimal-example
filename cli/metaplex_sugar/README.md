## Overview
Mint NFT(s) CLI Tools by Metaplex.

## Run
### Setup
1. Install [Metaplex Sugar](https://docs.metaplex.com/sugar/introduction)

2. Set RPC
```
% solana config set --url devnet
```

### Run
It's depend on version of Sugar. Check README at each directory.

## How to __
### How to get NFT Mint Address
Sugar doesn't show mint address. Check mint address from Solana Explorer or Solaneyes, Metaplex JS.

#### Solana Explorer (Search "Mint" in page):  
![Solana Explorer mint](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/cli/metaplex_sugar/docs/screenshot/example_mint_address.png?raw=true)

#### Solaneyes (If you success for "sugar launch", Solaneyes URL apeear in your terminal):  
![Solaneyes mint](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/cli/metaplex_sugar/docs/screenshot/example_Solaneyes_minted_nft.png?raw=true)

#### Metaplex JS: [@metaplex-foundation/js - findMintedNfts](https://metaplex-foundation.github.io/js/classes/js.CandyMachinesV2Client.html#findMintedNfts)

### How to Nested Collections
1. Mint a Standard NFT(Name: NFT A).
```
% sugar launch
% sugar mint
```

2. Create another Standard NFT(Name: NFT B) then, set collection NFT B to NFT A.
```
% sugar launch
% sugar collection set <NFT A Mint Address>
% sugar mint
```

NFT A will be Collection NFT.

Source: [Metaplex Docs - Nested Collections](https://docs.metaplex.com/programs/token-metadata/certified-collections#nested-collections)

![Nested Collections](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/cli/metaplex_sugar/docs/screenshot/Token-Metadata-Collections-Nested-Collection.png?raw=true)

### How to reset cache
If you want to reset or re-run Sugar, delete cache.json.

## Note
### Bulk mint
`sugar mint` will mint one NFT. If you need bulk mint, run `sugar mint -n <AMOUNT_OF_MINT>`.

## Reference
### Docs
- [Sugar Metaplex Docs](https://docs.metaplex.com/developer-tools/sugar/)
- [Metaboss Sign](https://metaboss.rs/sign.html)

### Sugar Command
```
% sugar -h
sugar-cli 1.1.0
Command line tool for creating and managing Metaplex Candy Machines.

USAGE:
    sugar [OPTIONS] <SUBCOMMAND>

OPTIONS:
    -h, --help                     Print help information
    -l, --log-level <LOG_LEVEL>    Log level: trace, debug, info, warn, error, off
    -V, --version                  Print version information

SUBCOMMANDS:
    bundlr            Interact with the bundlr network
    collection        Manage the collection on the candy machine
    create-config     Interactive process to create the config file
    deploy            Deploy cache items into candy machine config on-chain
    freeze            Commands for the Candy Machine Freeze feature
    hash              Generate hash of cache file for hidden settings
    help              Print this message or the help of the given subcommand(s)
    launch            Create a candy machine deployment from assets
    mint              Mint one NFT from candy machine
    reveal            Reveal the NFTs from a hidden settings candy machine
    show              Show the on-chain config of an existing candy machine
    sign              Sign one or all NFTs from candy machine
    thaw              Thaw a NFT or all NFTs in a candy machine
    unfreeze-funds    Unlock treasury funds after freeze is turned off or expires
    update            Update the candy machine config on-chain
    upload            Upload assets to storage and creates the cache config
    validate          Validate JSON metadata files
    verify            Verify uploaded data
    withdraw          Withdraw funds from candy machine account closing it
```
