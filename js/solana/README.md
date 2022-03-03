# Solana Web3 JavaScript
## Source
[Solana Web3 JavaScript API](https://docs.solana.com/developing/clients/javascript-api)

## Run
First Terminal:
```
% solana config set --url localhost
% solana-test-validator
```

Secodn Terminal:
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
