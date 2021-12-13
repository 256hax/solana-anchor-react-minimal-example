# Solana x Anchor x React Example
Solana x Anchor x React Minimal Examples. Experiment purpose only.


## Installation
- (Rust) rustup 1.24.3
- (Solana) solana-cli 1.8.5
- Yarn 1.22.10
- (Anchor) anchor-cli 0.18.2

Instructions: [Installing Dependencies by Anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-rust)
- [Phantom](https://phantom.app/) for Google Chrome


## Setup
### 1. DL and move to each example root directory.
```
% git clone https://github.com/256hax/solana-anchor-react-example.git
% cd solana-anchor-react-example/1.initialize/
```

### 2. Run local cluster and monitoring logs.
Open new terminal, then run local cluster.
```
% solana config set --url localhost
% solana-test-validator
```

Open another new terminal, then run monitoring logs.
```
% solana logs
```

### 3. Anchor build and deploy to local cluster.
Open another new terminal, then Anchor build and deploy.
```
% anchor build
% anchor deploy
```

### 4. Install React packages and run Web Server.
```
% cd app/
% yarn install
% yarn start
```

### 5. Go to Website and check actions.
Go to [http://localhost:3000](http://localhost:3000/) with Google Chrome.  
Open Console tab in Google Chrome DevTools. It will be shown result.


## Update Programs(Smart Contract)
Update any programs(ex: lib.rs) and move to each example root directory.

```
% anchor build
% anchor deploy
```


## Change ProgramID
Move to each example root directory.

### 1. Get New ProgramID.
```
% anchor build
% solana address -k target/deploy/initialize-keypair.json
```

### 2. Update to New ProgramID.

Anchor.toml
```
initialize = "[New Program ID]"
```

programs/initialize/src/lib.rs
```
declare_id!("[New Program ID]");
```

app/src/idl.json
```
% cp target/idl/initialize.json app/src/idl.json
```

### 3. Anchor build and deploy
```
% anchor build
% anchor deploy
```
