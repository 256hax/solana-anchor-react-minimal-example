# Rust Library
## Run
```
% cargo test -- --nocapture
```

## How To Test For Rust Files
### Case A: Including at lib.rs
lib.rs
```
pub mod <RUST FILE NAME>;
pub mod <RUST FILE NAME>;
```

### Case B: Define Library Name
Ref: https://doc.rust-lang.org/cargo/reference/cargo-targets.html#library

Cargo.toml
```
[lib]
name = "borsh_sample"    # The name of the target.
path = "src/borsh.rs"    # The source file of the target.
```

### Case C: Run with Rust File Name
Ref: https://doc.rust-lang.org/cargo/reference/cargo-targets.html#binaries

Cargo.toml
```
[[bin]]
name = "borsh_sample"
path = "src/borsh.rs"
```

Run with rust file:
```
% cargo test -- --nocapture <FUNCTION NAME IN TEST FILE>
ex) % cargo test -- --nocapture borsh_test_simple_struct
```
