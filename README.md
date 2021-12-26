# Solana x Anchor x React Minimal Example
Solana x Anchor x React Minimal Examples. Experiment purpose only.

## Installation
- (Rust) rustup 1.24.3
- (Solana) solana-cli 1.9.0
- (Anchor) anchor-cli 0.19.0

Instructions: [Installing Dependencies by Anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-rust)
- [Phantom](https://phantom.app/) for Google Chrome

## Setup
### 1. Run local cluster and monitoring logs
Open new terminal, then run local cluster.
```
% solana config set --url localhost
% solana-test-validator
```

Open another new terminal, then run monitoring logs.
```
% solana logs
```

### 2. DL and move to each example root directory
Open another new terminal.
```
% git clone https://github.com/256hax/solana-anchor-react-minimal-example.git
% cd solana-anchor-react-minimal-example/full-stack/initialize/
```

### 3. Anchor build and deploy to local cluster
#### 3-1. Get New Program ID
```
% anchor build
% solana address -k target/deploy/initialize-keypair.json
```

#### 3-2. Update to New ProgramID

Anchor.toml
```
initialize = "[New Program ID]"
```

programs/initialize/src/lib.rs
```
declare_id!("[New Program ID]");
```

#### 3-3. Anchor build and deploy
```
% anchor build
% anchor deploy
```

Copy idl file to app directory.
```
% cp target/idl/initialize.json app/src/idl.json
```

### 4. Install React packages, running Web Server
```
% cd app/
% npm install
% npm start
```

## Run minimal example DApps
### 1. Go to Website
Go to [http://localhost:3000](http://localhost:3000/) with Google Chrome.  
Open Console tab in Google Chrome DevTools. It will be shown result.  
Transactions will showing to terminal(monitoring log).

### 2. Change Network your Phantom
Phantom settings > Change Network > select "Localhost"

### 3. (important!) Airdrop for Phantom
Copy your Phantom Wallet Address, then airdrop.

```
% solana airdrop 5 [your Phantom Wallet Address]
```

### 4. Send Transaction
"Connect to Wallet" button, then "Send" button on Website.

![Overview](https://github.com/256hax/solana-anchor-react-minimal-example/blob/main/docs/screenshot/overview.png?raw=true)

## Update Programs(Smart Contract)
Update any programs(ex: lib.rs) and move to each example root directory.  
Don't forget to run local cluster(solana-test-validator).

```
% anchor build
% anchor deploy
```

## Errors
### Transaction Error:  TypeError: Cannot read properties of undefined (reading 'publicKey')
Restart your Chrome or super reload.

### Transaction Error:  Error: failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x0
Restart your Chrome or super reload.

### Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.
Insufficient your Phantom Wallet Address.  
Copy your Phantom Wallet Address, then airdrop.

```
% solana airdrop 5 [your Phantom Wallet Address]
```

Make sure your balance.
```
% solana balance [your Phantom Wallet Address]
```

### Error: unable to confirm transaction. This can happen in situations such as transaction expiration and insufficient fee-payer funds
It's incorrect Wallet Address for airdrop. Make sure correct Wallet Address.

### Transaction simulation failed: Attempt to load a program that does not exist
You missed anchor build and deploy. Try re-build and deploy.
```
% cd [each example root directory]
% anchor build
% anchor deploy
```

## Reference
- [Anchor Tutorial - GitHub](https://github.com/project-serum/anchor/tree/master/examples/tutorial)
