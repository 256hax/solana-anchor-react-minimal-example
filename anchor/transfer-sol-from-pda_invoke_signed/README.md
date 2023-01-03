# Transfer SOL from PDA
## Run
```
% npm i
% anchor test
```

terminal log:
```
  Transfer SOL from Provider PDA
provider => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
pda => 36nmcg93WoJaD2BvxL5vytc3DbSzd5uk6qq7mKw42DE3
bump => 252
taker => GDyt9UxX5aUwnv5Mgq19KvBpDVU8ugWuFsaiuF7ob998

--- before transfer ---
balancePda => 1 SOL
balanceTaker => 0 SOL
    ✔ Airdrop to PDA (316ms)

--- after transfer ---
balancePda => 0.999 SOL
balanceTaker => 0.001 SOL
    ✔ Transfer SOL from PDA (456ms)


  Transfer SOL from User PDA
user => AgLMmjzQo2UxroDa3G8Nwzv4ep1uJaz8ghRCBnpS2rv6
user pda => 7Pb5Cd86ZkguAtAHfNLqpw3JJ9XamvoFvKBo7UCYYLne
user pda bump => 255
taker => 2jdsGwKB3GpASbRxoEpA7vPw2mZdYmodHk8twpTCn48n

--- before transfer ---
balancePda => 1 SOL
balanceTaker => 0 SOL
    ✔ Airdrop to PDA (470ms)

--- after transfer ---
balancePda => 0.999 SOL
balanceTaker => 0.001 SOL
    ✔ Transfer SOL from PDA (461ms)


  4 passing (2s)

✨  Done in 3.14s.
```