# Arweave JavaScript
## Source
- [Arweave Docs - HTTP API](https://docs.arweave.org/developers/server/http-api)
- [ArweaveTeam/arweave-js](https://github.com/ArweaveTeam/arweave-js)
- [textury/arlocal](https://github.com/textury/arlocal)

## Run

First terminal:
```
% npx arlocal
```

Second terminal:
```
% npm install
% node [JS FILE]
```

## Note
### Airdrop
You should get airdrop AR when you submit.

Start ArLocal.
```
% npx arlocal
```

Airdrop(mint) on ArLocal.

http://127.0.0.1:1984/mint/<AR WALLET ADDRESS>/<AIRDROP AMOUNT>
ex) [http://127.0.0.1:1984/mint/96JyNRHl2a8-cF_w-p5KPN9O5cTxp4J1oESbR2_V8zI/100000000000000](http://127.0.0.1:1984/mint/96JyNRHl2a8-cF_w-p5KPN9O5cTxp4J1oESbR2_V8zI/100000000000000)

### 403 Error
If you got 403 error, insufficient funds.

### 410 Error or Memory Leak Error
Something wrong sometimes(cause of My Mac? or ArLocal bug?). You should reboot your Mac.
