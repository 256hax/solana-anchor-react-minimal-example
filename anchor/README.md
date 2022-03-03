# Anchor Examples

## Source
[project-serum/anchor](https://github.com/project-serum/anchor)
[Tutorials](https://github.com/project-serum/anchor/tree/master/examples/tutorial)
[Tests(Examples)](https://github.com/project-serum/anchor/tree/master/tests)

## Reference
### programs(Rust)
- [solana_program](https://docs.rs/solana-program/latest/solana_program/)
- [anchor_lang](https://docs.rs/anchor-lang/latest/anchor_lang/)
- [anchor_spl](https://docs.rs/anchor-spl/latest/anchor_spl/)

### tests(JS/TS)
- [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/#solana-javascript-api)
- [@solana/spl-token](https://github.com/solana-labs/solana-program-library/blob/master/token/js/client/token.js)
- [@project-serum/serum](https://github.com/project-serum/serum-ts/tree/master/packages/serum)
- [@project-serum/anchor](https://project-serum.github.io/anchor/ts/index.html)
- [@project-serum/common](https://github.com/project-serum/serum-ts/tree/master/packages/common)

## Run
at each directory:
```
% npm install
% anchor test
```

## Error
### npm error
If you got some npm error, delete packages and install again.

Delete following:
- packages-lock.json
- node-modules
- package.json

Install packages:
```
npm add @project-serum/anchor
npm add @solana/web3.js
npm add @solana/spl-token
npm add chai
npm add ts-mocha
npm add ts-node
npm add @types/chai
npm add @types/mocha
```

## Other
If you got some errors, check latest source at Anchor.
