## CLI
### Starter Template
#### Anchor
```
% anchor init [PJ Name] --javascript
```

#### React
```
% npx create-react-app app

% npm install \
assert \
@project-serum/anchor @solana/web3.js \
@solana/wallet-adapter-react-ui \
@solana/wallet-adapter-wallets \
@solana/wallet-adapter-base
```

### Airdrop to Target Deploy Keypair
```
% cd full-stack/initialize/
% ANCHOR_WALLET_ADDRESS=$(solana address -k target/deploy/initialize-keypair.json)
% solana balance $ANCHOR_WALLET_ADDRESS
% solana airdrop 1 $ANCHOR_WALLET_ADDRESS
```

## Programs Deploying to devnet
There're Two ways available.

### Case1: Use CLI
```
% anchor deploy --provider.cluster devnet
```

### Case2: Use Anchor.toml
Replace localnet to devnet at Anchor.toml
```
cluster = "devnet"
```

Anchor build and deploy.
```
% anchor build
% anchor deploy
```

### anchor test
Should Use env() instead local().
```
// const provider = anchor.Provider.local();
const provider = anchor.Provider.env();
```

Then setup for devnet.
```
% solana config set --url devnet
```

## Frontend connecting to devnet
### Frontend file
Add clusterApiUrl and replace network at App.js.
```
import { ..., clusterApiUrl } from '@solana/web3.js';

...

const network = clusterApiUrl('devnet');
```

### Config
1. Change localhost to devnet in Phantom Wallet.
2. Change cluster URL with Solana CLI.
```
% solana config set --url devnet
```
3. Copy Phantom Wallet Address, then Airdrop there.
```
% solana airdrop 1 [Phantom Wallet Address]
```


## Docker
### Image
- [Anchor Docker Image](https://project-serum.github.io/anchor/getting-started/verification.html#images)  

ex) Should replace to latest version.
```
docker pull projectserum/build:v0.19.0
```

Important: Should be latest version. Especially Solana and Anchor.

- [Minimal Solana Docker image](https://github.com/solana-labs/solana/tree/master/sdk/docker-solana
