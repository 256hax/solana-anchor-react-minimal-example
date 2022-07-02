## Overview
```
Sugar is an alternative to the current Metaplex Candy Machine CLI.
```

## Setup
[Metaplex Sugar](https://docs.metaplex.com/sugar/introduction)

## Run
### Mint

```
% cd workspace
% sugar validate
% sugar upload
% sugar deploy
% sugar verify
% sugar mint

[1/2] 🔍 Loading candy machine
Candy machine ID: 3GX7ESDWsk3asWYwdzmXAuxnTLswALFRjSUpJTvBgUrs
▪▪▪▪▪ Done
[2/2] 🍬 Minting from candy machine
Candy machine ID: 3GX7ESDWsk3asWYwdzmXAuxnTLswALFRjSUpJTvBgUrs
▪▪▪▪▪ Signature: J5u8F7NSWRDWjciy6C3L7hhj3zrSK4wPEaZS56WfVDHXeHp34veiq7SYoB5qBqYV1ZLWbpWBLp3idrrYQNrNpWh
```

Get minted Signature then get Mint Address(check "Mint" element).
![sample mint](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/cli/metaplex_sugar/example_mint_address.png?raw=true)

### Verify(Sign) NFT
```
% metaboss sign one --keypair ~/.config/solana/id.json --account C9EB2cvnuHiJVj98prPbxfkpo4FYW7Ruc4pJGvEESAhz
```

## Note
- I recommend delete cache.json before change config or mint again.
- Update tools(ex: sugar, metaboss) for latest.

## Reference
- [Sugar Command](https://docs.metaplex.com/sugar/asset-preparation-and-deployment)
- [Metaboss Sign]([Metaboss Sign](https://metaboss.rs/sign.html))