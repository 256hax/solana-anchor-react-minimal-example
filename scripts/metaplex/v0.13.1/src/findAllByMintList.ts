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

  const [nftA, nftB] = await metaplex
      .nfts()
      .findAllByMintList([mintA, mintB])
      .run();
 
  console.log('nftA =>', nftA);
  console.log('nftB =>', nftB);
};

main();

/*
% ts-node <THIS FILE>
nftA => {
  model: 'nft',
  lazy: true,
  address: Pda {
    _bn: <BN: c3c5e6a1b194a824b031f37ffa888b97e6446c216ea9100afa90ac6178375473>,
    bump: 255
  },
  mintAddress: PublicKey {
    _bn: <BN: 3bada9465610efb26cbca09c52a21c877e4fb184aef430a80b38325871dde77a>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 2a95ca30b3993c66d0889d22486f5a52f2c66669109b60b475acf07621879ca0>
  },
  name: 'OddKey - Spawnoki #2124',
  symbol: 'ODKY',
  uri: 'https://arweave.net/W-20MpV-N1l6e_vxWxjmGfFnGkiiUDn7GJAsgYmJ6fU',
  isMutable: true,
  primarySaleHappened: true,
  sellerFeeBasisPoints: 1000,
  editionNonce: 254,
  creators: [
    { address: [PublicKey], verified: true, share: 0 },
    { address: [PublicKey], verified: false, share: 100 }
  ],
  tokenStandard: 0,
  collection: {
    verified: true,
    key: PublicKey {
      _bn: <BN: 791ea3d957bdbb99cec0c7163965ee07424a2b655434aaa6acc3192d1693b608>
    }
  },
  uses: null,
  metadataAddress: Pda {
    _bn: <BN: c3c5e6a1b194a824b031f37ffa888b97e6446c216ea9100afa90ac6178375473>,
    bump: 255
  }
}
nftB => {
  model: 'nft',
  lazy: true,
  address: Pda {
    _bn: <BN: 7630157cc5f2f80c0fafaf6cab335297a4ad486b27220e53900ccf4e046ab060>,
    bump: 254
  },
  mintAddress: PublicKey {
    _bn: <BN: 9cd2962810fe4d5032860bf58bb681dd3d409498b15dedb3e5b89e9c2fbe5752>
  },
  updateAuthorityAddress: PublicKey {
    _bn: <BN: 843b97104c1984ecff17a9fb451b5b60911ed41f5c56351f4d92eceddb5c23e2>
  },
  name: 'SMB #2756',
  symbol: 'SMB',
  uri: 'https://arweave.net/Z57LxpnPAgYfWEABs1gfKhyFUtR3x9Pln_9h959sFog',
  isMutable: true,
  primarySaleHappened: true,
  sellerFeeBasisPoints: 600,
  editionNonce: 254,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  tokenStandard: 0,
  collection: {
    verified: true,
    key: PublicKey {
      _bn: <BN: 67e55ab262f537c60026656df7011acd610d91f5ecb5e3c07a97131c1f2b0ce>
    }
  },
  uses: null,
  metadataAddress: Pda {
    _bn: <BN: 7630157cc5f2f80c0fafaf6cab335297a4ad486b27220e53900ccf4e046ab060>,
    bump: 254
  }
}
*/