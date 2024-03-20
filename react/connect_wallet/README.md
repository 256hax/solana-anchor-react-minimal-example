# Solana Wallet Adapter Minimal Example
## Overview
Solana wallet adapter with [Vite](https://vitejs.dev/) example.  
If you need to show multiple wallets(e.g. Phantom and Solflare), use this SDK.  
This minimal example copy from [solana-labs/wallet-adapter](https://github.com/anza-xyz/wallet-adapter) .

## Run
```
% npm i
% npm run dev
```

## Implementation
### Implementaion without Metaplex
1. Install Solana Wallet adapter [Installation](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)

Rewrite require to import:
```
// Default styles that can be overridden by your app
import('@solana/wallet-adapter-react-ui/styles.css');
```

2. Install dependency packages(Next.js, Vite, Express) [Metaplex JS SDK Examples](https://github.com/metaplex-foundation/js-examples)


### Implementaion with Metaplex
1. Install Solana Wallet adapter [Installation](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)

Rewrite require to import:
```
// Default styles that can be overridden by your app
import('@solana/wallet-adapter-react-ui/styles.css');
```

2. Install dependency packages(Next.js, Vite, Express) [Metaplex JS SDK Examples](https://github.com/metaplex-foundation/js-examples)

3. Adjust interface [Connecting to Umi](https://developers.metaplex.com/umi/connecting-to-umi#connecting-w-wallet-adapter)

## Note
If you get some problem(e.g. Frontend doesn't work), try disabling Linter.  

## Reference
- [Solana Wallet Adapter GitHub](https://github.com/anza-xyz/wallet-adapter)
- [Wallet Adapter List](https://github.com/anza-xyz/wallet-adapter/blob/master/PACKAGES.md)