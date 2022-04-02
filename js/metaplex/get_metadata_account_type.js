// Ref: https://docs.metaplex.com/sdk/js/getting-started#how-to-retrieve-data-by-other-programs
import { Connection, programs } from '@metaplex/js';
const { metaplex: { Store, AuctionManager }, metadata: { Metadata }, auction: { Auction }, vault: { Vault } } = programs;

const connection = new Connection('devnet');
const tokenPublicKey = 'ECeH95TYYt6da389Y9ab6gFBHpjewUn7C2p6Af4iPtt3';

const run = async () => {
  try {
    const metadata        = await Metadata.load(connection, tokenPublicKey);
    // const auction         = await Auction.load(connection, tokenPublicKey);
    // const vault           = await Vault.load(connection, tokenPublicKey);
    // const auctionManager  = await AuctionManager.load(connection, tokenPublicKey);
    // const store           = await Store.load(connection, tokenPublicKey);

    console.log(metadata);
    // console.log(auction);
    // console.log(vault);
    // console.log(auctionManager);
    // console.log(store);
  } catch {
    console.log('Failed to fetch metadata');
  }
};

run();

/*
% node <THIS FILE>

Metadata {
  pubkey: PublicKey {
    _bn: <BN: c42378384848d2f0c2ae4a08d6f5bce197708ce570f75730ebfd94ef29a3549c>
  },
  info: {
    data: <Buffer 04 f5 a4 4a 6f 36 83 96 11 71 1f 04 14 9f 51 dd 40 6d d4 bc 52 cb 86 f2 0d d2 b1 16 08 a6 2c 7e e9 b8 fb e8 04 11 80 96 12 41 f8 ef 0c d2 68 9a bb 04 ... 629 more bytes>,
    executable: false,
    lamports: 5616720,
    owner: PublicKey {
      _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
    },
    rentEpoch: 288
  },
  data: MetadataData {
    key: 4,
    updateAuthority: 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
    mint: 'DT6ocLTqhBeCzGzFH2m8skYhUDky8bb9NpvMs7Lg5vH8',
    data: MetadataDataData {
      name: '2',
      symbol: 'NB',
      uri: 'https://arweave.net/nJEuOaJaVzJZiDXIKsVLdt5RSY5QJNIQpOrSkCPRXoU',
      sellerFeeBasisPoints: 500,
      creators: [Array]
    },
    primarySaleHappened: 1,
    isMutable: 1,
    editionNonce: 255,
    tokenStandard: undefined,
    collection: undefined,
    uses: undefined
  }
}
*/
