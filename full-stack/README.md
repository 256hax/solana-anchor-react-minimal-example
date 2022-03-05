# Full Stack (Solana x Anchor x React) Examples

## Installation
- (Rust) rustup 1.24.3
- (Solana) [solana-cli](https://docs.solana.com/cli/install-solana-cli-tools) 1.9.0
- (Anchor) [anchor-cli](https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor) 0.19.0

Instructions: [Installing Dependencies by Anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-rust)

- [Phantom](https://phantom.app/) for Google Chrome

Important: Should be latest version. Especially Solana and Anchor.

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
% cd solana-anchor-react-minimal-example/full-stack/initialize/anchor/
```

### 3. Anchor build and deploy to local cluster
#### 3-1. Get New Program ID
```
% anchor build
% solana address -k target/deploy/initialize-keypair.json
[NEW PROGRAM ID]
```

#### 3-2. Update to New ProgramID

Anchor.toml
```
initialize = "[NEW PROGRAM ID]"
```

programs/initialize/src/lib.rs
```
declare_id!("[NEW PROGRAM ID]");
```

### [OPTIONS] Insufficient fee-payer funds error
M1 Mac or Linux get following error when airdrop or deploy to localnet.

```
Error: unable to confirm transaction. This can happen in situations such as transaction expiration and insufficient fee-payer funds
```

Stop solana-test-validator, then Try following.

```
% ANCHOR_WALLET_ADDRESS=$(solana address -k target/deploy/initialize-keypair.json)
% solana-test-validator --bpf-program $ANCHOR_WALLET_ADDRESS target/deploy/initialize.so
```


#### 3-3. Create Keypair and Airdrop
Create keypair.

```
% solana-keygen new
```

Airdrop to your wallet. Replace [KEYPAIR PATH] and [YOUR ADDRESS] to your value.

```
% solana config get
Config File: /root/.config/solana/cli/config.yml
RPC URL: http://localhost:8899
WebSocket URL: ws://localhost:8900/ (computed)
Keypair Path: [KEYPAIR PATH]
Commitment: confirmed

% solana address -k [KEYPAIR PATH]
[YOUR ADDRESS]

% solana airdrop 1 [YOUR ADDRESS]
```

#### 3-4. Anchor build and deploy
Deploy to localnet cluster.  
Make sure running solana-test-validator before it.  

```
% anchor build
% anchor deploy
```

If you got following error, perhaps you have already got successful for deploying.

```
Error: Account CKSsKGvY7gLtGQpL1GZ9UkmmKSVBbBUnp6DEsDtPNQk7 is not an upgradeable program or already in use
There was a problem deploying: Output { status: ExitStatus(unix_wait_status(256)), stdout: "", stderr: "" }.
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
% solana airdrop 2 [your Phantom Wallet Address]
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
% solana airdrop 2 [YOUR PHANTOM WALLET ADDRESS]
```

Make sure your balance.
```
% solana balance [YOUR PHANTOM WALLET ADDRESS]
```

### Error: unable to confirm transaction. This can happen in situations such as transaction expiration and insufficient fee-payer funds
It's incorrect Wallet Address for airdrop. Make sure correct Wallet Address.

### Transaction simulation failed: Attempt to load a program that does not exist
You missed anchor build and deploy. Try re-build and deploy.
```
% cd [EACH EXAMPLE ROOT DIRECTORY]
% anchor build
% anchor deploy
```

## Reference
- [Anchor Tutorial - GitHub](https://github.com/project-serum/anchor/tree/master/examples/tutorial)
