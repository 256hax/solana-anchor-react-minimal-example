// Ref: https://github.com/metaplex-foundation/js#findbymint
import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const main = async() => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const wallet = Keypair.generate();

  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());

  const mint = new PublicKey("BZAqzSiRyF1kQKhHN9z1o7WEJvr3tBkAL7tbDmMEM7A1");

  const nft = await metaplex.nfts().findByMint(mint);

  const nftMetadata = await nft.metadataTask.run();

  console.log('nft =>', nft);
  console.log('NFT Image =>', nft.metadata.image);
  console.log('Mint Address =>', nft.mint.toString());
  console.log('nftMetadata =>', nftMetadata);
  
  if (nft.isOriginal()) { // true
    const currentSupply = nft.originalEdition?.supply;
    const maxSupply = nft.originalEdition?.maxSupply;
    console.log('currentSupply =>', currentSupply.toString());
    console.log('maxSupply =>', maxSupply.toString());
    
  }

  if (nft.isPrint()) { // false
    const parentEdition = nft.printEdition?.parent;
    const editionNumber = nft.printEdition?.edition;
    console.log('parentEdition =>', parentEdition);
    console.log('editionNumber =>', editionNumber);
  }
};

main();

/*
% ts-node <THIS FILE>
nft => Nft {
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
    status: 'successful',
    result: {
      name: 'SMB #2756',
      symbol: 'SMB',
      description: 'SMB is a collection of 5000 randomly generated 24x24 pixels NFTs on the Solana Blockchain. Each SolanaMonkey is unique and comes with different type and attributes varying in rarity.',
      seller_fee_basis_points: 600,
      image: 'https://arweave.net/ovSe7hNSNMYGQU55V8pOfIsIlZ4KIQNip6g25AnMu9s',
      external_url: 'https://solanamonkey.business/',
      collection: [Object],
      attributes: [Array],
      properties: [Object]
    },
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
    status: 'successful',
    result: {
      publicKey: [Pda],
      exists: true,
      data: [MasterEditionV2],
      executable: false,
      lamports: 2853600,
      owner: [PublicKey],
      rentEpoch: 324
    },
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
NFT Image => https://arweave.net/ovSe7hNSNMYGQU55V8pOfIsIlZ4KIQNip6g25AnMu9s
Mint Address => BZAqzSiRyF1kQKhHN9z1o7WEJvr3tBkAL7tbDmMEM7A1
nftMetadata => {
  name: 'SMB #2756',
  symbol: 'SMB',
  description: 'SMB is a collection of 5000 randomly generated 24x24 pixels NFTs on the Solana Blockchain. Each SolanaMonkey is unique and comes with different type and attributes varying in rarity.',
  seller_fee_basis_points: 600,
  image: 'https://arweave.net/ovSe7hNSNMYGQU55V8pOfIsIlZ4KIQNip6g25AnMu9s',
  external_url: 'https://solanamonkey.business/',
  collection: { name: 'SMB Gen2', family: 'SMB' },
  attributes: [
    { trait_type: 'Attributes Count', value: 3 },
    { trait_type: 'Type', value: 'Skeleton' },
    { trait_type: 'Clothes', value: 'Pirate Vest' },
    { trait_type: 'Ears', value: 'None' },
    { trait_type: 'Mouth', value: 'Pipe' },
    { trait_type: 'Eyes', value: 'None' },
    { trait_type: 'Hat', value: 'Pirate Hat' }
  ],
  properties: {
    files: [ [Object], [Object] ],
    category: 'image',
    creators: [ [Object] ]
  }
}
currentSupply => 0
maxSupply => 0
*/