# Guess the Number
## Overview
Guess the Number game using NFT.
Payer offer Question and Prize(SOL) for takers. (Question using NFT)
Takers answer then winner get prize. (Answer using NFT)

Experiment purpose only.

## Aproach
- Question and Answer are NFTs.
- Takers need to deposit NFT for answer.

## Run
```
% npm i
% anchor test
```

## Payer and ProgramID Key Pairs
### Sandbox Keys
#### ProgramID
73nne9bqtG4wJiey1spoFfSsstZzE8TwPyvUogP1yiep

```
[184,78,144,186,157,22,121,157,186,185,56,17,24,139,130,175,108,89,132,251,16,95,114,137,111,209,63,203,199,64,37,131,89,221,13,249,235,249,120,74,80,5,67,85,44,193,144,125,96,229,203,157,53,8,163,149,225,69,92,99,68,64,91,149]
```

#### Payer Keypair
HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg

```
[42,10,22,97,116,115,107,57,226,247,40,179,216,11,216,9,110,233,110,240,85,78,144,173,253,79,75,12,175,216,43,214,245,164,74,111,54,131,150,17,113,31,4,20,159,81,221,64,109,212,188,82,203,134,242,13,210,177,22,8,166,44,126,233]
```

### Pretty Clean Keys
#### ProgramID
4XNQDi8YPRdUcosLREh8ZC97SMxFskJ3DC8weboBCqQc

```
[245,196,235,250,121,107,12,48,37,138,41,111,191,156,155,97,79,114,241,164,100,15,23,170,155,225,171,94,201,159,10,157,52,90,174,183,23,97,175,251,13,94,201,108,176,239,124,106,205,4,132,9,25,40,233,174,142,111,221,153,20,186,18,49]
```

#### Payer Keypair
88K2xdjhYggYAjWwvcU44XNbjLYYDKHvX87wHvspB9Py

```
[98,156,147,246,99,55,15,21,117,4,187,166,115,166,221,79,86,46,184,19,41,37,75,55,204,195,46,174,200,1,165,117,105,225,67,215,130,231,154,212,253,226,213,42,232,7,156,93,50,132,187,17,73,172,85,5,165,191,201,12,32,175,212,84]
```

## Error
If you got following error, try again later or use custom RPC(e.g. QuickNode) instead of Solana Devnet RPC.

```
AccountNotFoundError: The account of type [MintAccount] was not found at the provided address [Hrp6ikfEJ2zbQMFgY4KpuX7DSkxMzsmv2LY3qTmLQUya].
```