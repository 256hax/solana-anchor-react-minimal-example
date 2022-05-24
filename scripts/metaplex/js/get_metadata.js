// Ref: https://docs.metaplex.com/sdk/js/getting-started#your-first-request
import { Connection, programs } from '@metaplex/js';
const { metadata: { Metadata } } = programs;

const connection = new Connection('devnet');
const tokenPublicKey = 'Gz3vYbpsB2agTsAwedtvtTkQ1CG9vsioqLW3r9ecNpvZ';

const run = async () => {
  try {
    const ownedMetadata = await Metadata.load(connection, tokenPublicKey);
    console.log(ownedMetadata);
  } catch {
    console.log('Failed to fetch metadata');
  }
};

run();

/*
% node <THIS FILE>

Metadata {
  pubkey: PublicKey {
    _bn: <BN: ed7cb71bf67ab48e4987e7a3498bfecbe1bac753a43fc8f9fa00ad9289bb78d6>
  },
  info: {
    data: <Buffer 04 3c dd 7f f1 01 5b 30 73 5c 68 52 33 c0 ba 6f f7 90 d7 32 cc ff 87 9f 82 87 2b 6c d1 9a 06 18 0b 64 75 7d 20 c2 d3 ff bc c6 c5 be f5 24 7b 26 8e d5 ... 629 more bytes>,
    executable: false,
    lamports: 5616720,
    owner: PublicKey {
      _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
    },
    rentEpoch: 254
  },
  data: MetadataData {
    key: 4,
    updateAuthority: '56bMjFLPSvZztdBk7D9g3LYTZNw3ApN6HKwyrQRCrLbL',
    mint: '7m9gHwaYRd5BGmDedSM7pvEAfakqYbUnuNBhNVgreVB9',
    data: MetadataDataData {
      name: 'Cat #3',
      symbol: '',
      uri: 'https://arweave.net/APnrDX2KUusunMAH8dz7Dq5UfbiJKDTrOYT2-PNMuDw',
      sellerFeeBasisPoints: 0,
      creators: [Array]
    },
    primarySaleHappened: 1,
    isMutable: 0
  }
}
*/
