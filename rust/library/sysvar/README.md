# Sysvar Example

```
"
Solana exposes a variety of cluster state data to programs via sysvar accounts. These accounts are populated at known addresses published along with the account layouts in the solana-program crate, and outlined below.

There are two ways for a program to access a sysvar.

The first is to query the sysvar at runtime via the sysvar's get() function:

  let clock = Clock::get()

The following sysvars support get:
  - Clock
  - EpochSchedule
  - Fees
  - Rent
"
```
[Sysvar Cluster Data](https://docs.solana.com/developing/runtime-facilities/sysvars)

## Program Source
[solana-program-library/examples/rust/sysvar/](https://github.com/solana-labs/solana-program-library/tree/2e1286b06a8f96a1f6a5355fd188f11ff34447f8/examples/rust/sysvar)

## reference
[Soalana Sysvar Cluster Data](https://docs.solana.com/developing/runtime-facilities/sysvars)
