# Solana Web3 JavaScript
## Source
[Solana Web3 JavaScript API](https://docs.solana.com/developing/clients/javascript-api)

## Run
First Terminal:
```
% solana config set --url localhost
% solana-test-validator
```

Second Terminal:
```
% npm install
% node <JS FILE>
```

For example:
```
% node create_transaction.js
signature ->  4nRgQQEcW8qsA9f9v8sTg8LByxo7hv53xjir6xp27zXdNUB31cqen16DkMoX9tgCzPJm2MppnpTswB3ghMc1KiRW"
```

## Error
If you got some npm error, delete packages and install again.

Delete following:
- packages-lock.json
- node-modules
- package.json

Install packages:
```
npm add @solana/web3.js
npm add @solana/spl-token
npm add sleep
```

## SPL Token
### Documents
[Solana Cookbook - Interactin with Tokens](https://solanacookbook.com/references/token.html#what-do-i-need-to-get-started-with-spl-tokens)

### @solana/spl-token@v0.1.8 (previous version)
- [create_mint_and_transfer_tokens.js](https://github.com/solana-labs/solana-program-library/blob/%40solana/spl-token%40v0.1.8/token/js/examples/create_mint_and_transfer_tokens.js)
- [instruction.rs](https://github.com/solana-labs/solana-program-library/blob/%40solana/spl-token%40v0.1.8/token/program/src/instruction.rs)