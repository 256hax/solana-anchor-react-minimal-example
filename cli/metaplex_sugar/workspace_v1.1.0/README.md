## Run
### Mint
```
% cd workspace_<Version of Sugar>
% sugar validate
% sugar launch
% sugar mint
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