## Overview
```
Sugar is an alternative to the current Metaplex Candy Machine CLI.
```

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

### Verify(Sign) NFT for Creator
Collection NFT has verified by Sugar but Edition NFT hasn't verified yet.

Metaboss verify(Sign) command:
```
metaboss sign one --keypair <PATH_TO_KEYPAIR> --account <MINT_ACCOUNT>
```

Example:
```
% metaboss sign one --keypair ~/.config/solana/id.json --account 5pZHC5sUKj5w5d36ahNnqnsnNVSRK1eejvgMmPAaenJE
```

## Note
- I recommend delete cache.json before change config or mint again.
- Update tools(e.g. sugar, metaboss) for latest.