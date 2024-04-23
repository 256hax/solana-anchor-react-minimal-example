// Ref: https://solana.com/docs/advanced/lookup-tables
import {
  SystemProgram,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  Connection,
  LAMPORTS_PER_SOL,
  CreateAccountParams,
  AddressLookupTableProgram,
} from '@solana/web3.js';

export const fetchAddressLookupTable = async () => {
  // const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // -------------------------------------------
  //  Fetch an Addresses Lookup Table
  // -------------------------------------------
  // define the `PublicKey` of the lookup table to fetch
  const lookupTableAddress = new PublicKey('7b6pc8wU8VkoS9bB9wX24nf5z9BnyQCD9GZ81j329Fva');

  // get the table from the cluster
  const lookupTableAccount = (
    await connection.getAddressLookupTable(lookupTableAddress)
  ).value;

  if (!lookupTableAccount) throw new Error('lookupTableAccount not found.');

  // `lookupTableAccount` will now be a `AddressLookupTableAccount` object

  console.log('lookupTableAccount =>', lookupTableAccount);
};

fetchAddressLookupTable();

/*
ts-node fetchAddressLookupTable.ts
(node:54134) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
lookupTableAccount => AddressLookupTableAccount {
  key: PublicKey [PublicKey(7b6pc8wU8VkoS9bB9wX24nf5z9BnyQCD9GZ81j329Fva)] {
    _bn: <BN: 61e2735e1ac9cb62f2627966713b9f2934f352a5c9c657dfbb8fe66d0a36d72b>
  },
  state: {
    deactivationSlot: 18446744073709551615n,
    lastExtendedSlot: 0,
    lastExtendedSlotStartIndex: 0,
    authority: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
      _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>
    },
    addresses: []
  }
}
*/
