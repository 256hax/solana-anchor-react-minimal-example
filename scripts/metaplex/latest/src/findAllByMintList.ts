// Ref: https://github.com/metaplex-foundation/js#findallbymintlist
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const mintA = new PublicKey("51xeBTXTHK7MHv5Po3zW68rAgTAMv7KCXzz62xQfsQVP");
  const mintB = new PublicKey("BZAqzSiRyF1kQKhHN9z1o7WEJvr3tBkAL7tbDmMEM7A1");

  const [nftA, nftB] = await metaplex.nfts().findAllByMintList([mintA, mintB]);
 
  console.log('nftA =>', nftA);
  console.log('nftB =>', nftB);

  // await nft.metadataTask.run();
  // await nft.EditionTask.run();
  // 
  // if (nftA.isOriginal()) {
  //   const currentSupply = nft.originalEdition.supply;
  //   const maxSupply = nft.originalEdition.maxSupply;
  // }
  // 
  // if (nft.isPrint()) {
  //   const parentEdition = nft.printEdition.parent;
  //   const editionNumber = nft.printEdition.edition;
  // }
  
};

main();

/*
% ts-node <THIS FILE>
nftA => Nft {
  metadataAccount: {
    publicKey: Pda {
      _bn: <BN: c3c5e6a1b194a824b031f37ffa888b97e6446c216ea9100afa90ac6178375473>,
      bump: 255
    },
    exists: true,
    data: Metadata {
      key: 4,
      updateAuthority: [PublicKey],
      mint: [PublicKey],
      data: [Object],
      primarySaleHappened: true,
      isMutable: true,
      editionNonce: 254,
      tokenStandard: 0,
      collection: [Object],
      uses: null,
      collectionDetails: null
    },
    executable: false,
    lamports: 5616720,
    owner: PublicKey {
      _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
    },
    rentEpoch: 323
  },
  metadataTask: Task {
    status: 'pending',
    result: undefined,
    error: undefined,
    callback: [Function (anonymous)],
    children: [],
    context: {},
    eventEmitter: EventEmitter {
      _events: Events <Complex prototype> {},
      _eventsCount: 0
    }
  },
  editionTask: Task {
    status: 'pending',
    result: undefined,
    error: undefined,
    callback: [AsyncFunction (anonymous)],
    children: [],
    context: {},
    eventEmitter: EventEmitter {
      _events: Events <Complex prototype> {},
      _eventsCount: 0
    }
  },
  updateAuthority: PublicKey {
    _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
  },
  mint: PublicKey {
    _bn: <BN: 3bada9465610efb26cbca09c52a21c877e4fb184aef430a80b38325871dde77a>
  },
  name: 'OddKey - Spawnoki #2124',
  symbol: 'ODKY',
  uri: 'https://arweave.net/W-20MpV-N1l6e_vxWxjmGfFnGkiiUDn7GJAsgYmJ6fU',
  sellerFeeBasisPoints: 1000,
  creators: [
    { address: [PublicKey], verified: true, share: 0 },
    { address: [PublicKey], verified: false, share: 100 }
  ],
  primarySaleHappened: true,
  isMutable: true,
  editionNonce: 254,
  tokenStandard: 0,
  collection: {
    verified: true,
    key: PublicKey {
      _bn: <BN: 791ea3d957bdbb99cec0c7163965ee07424a2b655434aaa6acc3192d1693b608>
    }
  },
  uses: null
}
nftB => Nft {
  metadataAccount: {
    publicKey: Pda {
      _bn: <BN: 7630157cc5f2f80c0fafaf6cab335297a4ad486b27220e53900ccf4e046ab060>,
      bump: 254
    },
    exists: true,
    data: Metadata {
      key: 4,
      updateAuthority: [PublicKey],
      mint: [PublicKey],
      data: [Object],
      primarySaleHappened: true,
      isMutable: true,
      editionNonce: 254,
      tokenStandard: 0,
      collection: [Object],
      uses: null,
      collectionDetails: null
    },
    executable: false,
    lamports: 5616720,
    owner: PublicKey {
      _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
    },
    rentEpoch: 323
  },
  metadataTask: Task {
    status: 'pending',
    result: undefined,
    error: undefined,
    callback: [Function (anonymous)],
    children: [],
    context: {},
    eventEmitter: EventEmitter {
      _events: Events <Complex prototype> {},
      _eventsCount: 0
    }
  },
  editionTask: Task {
    status: 'pending',
    result: undefined,
    error: undefined,
    callback: [AsyncFunction (anonymous)],
    children: [],
    context: {},
    eventEmitter: EventEmitter {
      _events: Events <Complex prototype> {},
      _eventsCount: 0
    }
  },
  updateAuthority: PublicKey {
    _bn: <BN: 843b97104c1984ecff17a9fb451b5b60911ed41f5c56351f4d92eceddb5c23e2>
  },
  mint: PublicKey {
    _bn: <BN: 9cd2962810fe4d5032860bf58bb681dd3d409498b15dedb3e5b89e9c2fbe5752>
  },
  name: 'SMB #2756',
  symbol: 'SMB',
  uri: 'https://arweave.net/Z57LxpnPAgYfWEABs1gfKhyFUtR3x9Pln_9h959sFog',
  sellerFeeBasisPoints: 600,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  primarySaleHappened: true,
  isMutable: true,
  editionNonce: 254,
  tokenStandard: 0,
  collection: {
    verified: true,
    key: PublicKey {
      _bn: <BN: 67e55ab262f537c60026656df7011acd610d91f5ecb5e3c07a97131c1f2b0ce>
    }
  },
  uses: null
}
*/