// Ref: https://github.com/metaplex-foundation/js#create
import { Metaplex, keypairIdentity, bundlrStorage, useMetaplexFile } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from 'fs';

const main = async() => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const wallet = Keypair.generate();


  // airdrop
  let airdropSignature = await connection.requestAirdrop(
      wallet.publicKey,
      LAMPORTS_PER_SOL,
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });

  // const balance = await connection.getBalance(wallet.publicKey);
  // console.log(balance);
  // End airdrop


  // Ref:
  //  bundlrStorage: https://github.com/metaplex-foundation/js#bundlrstorage
  const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
      }));

  const { uri } = await metaplex.nfts().uploadMetadata({
      name: "My NFT",
      description: "My description",
      image: "https://arweave.net/ovSe7hNSNMYGQU55V8pOfIsIlZ4KIQNip6g25AnMu9s",
  });

  // Ref:
  //  The Nft Mode: https://github.com/metaplex-foundation/js#the-nft-model
  const { nft } = await metaplex.nfts().create({
      uri: uri,
      maxSupply: 1,
  });

  console.log('nft =>', nft);
  console.log('Mint Address =>', nft.mint.toString());
};

main();

/*
% ts-node <THIS FILE>
nft => Nft {
  metadataAccount: {
    publicKey: Pda {
      _bn: <BN: 8cb04292f83f0e6b549b1dcb1a680bcdd7ea322574cba9ffaa0a07a98ea17d3b>,
      bump: 254
    },
    exists: true,
    data: Metadata {
      key: 4,
      updateAuthority: [PublicKey],
      mint: [PublicKey],
      data: [Object],
      primarySaleHappened: false,
      isMutable: false,
      editionNonce: 255,
      tokenStandard: 0,
      collection: null,
      uses: null,
      collectionDetails: null
    },
    executable: false,
    lamports: 5616720,
    owner: PublicKey {
      _bn: <BN: b7065b1e3d17c45389d527f6b04c3cd58b86c731aa0fdb549b6d1bc03f82946>
    },
    rentEpoch: 336
  },
  metadataTask: Task {
    status: 'successful',
    result: {
      name: 'My NFT',
      description: 'My description',
      image: 'https://arweave.net/ovSe7hNSNMYGQU55V8pOfIsIlZ4KIQNip6g25AnMu9s'
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
      rentEpoch: 336
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
    _bn: <BN: 90ee6ac3e5d2971f8011199245126f2a874039f51b26d012064e555987fd0e2a>
  },
  mint: PublicKey {
    _bn: <BN: 626a4b967a3fdf73971729ea040088feabe698e2c5c98c307f2110e0fd6c2f69>
  },
  name: 'My NFT',
  symbol: '',
  uri: 'https://arweave.net/KJaN6_zeXxwiflQePJrYasxpshidj2w_rtlIrDzTLJQ',
  sellerFeeBasisPoints: 500,
  creators: [ { address: [PublicKey], verified: true, share: 100 } ],
  primarySaleHappened: false,
  isMutable: false,
  editionNonce: 255,
  tokenStandard: 0,
  collection: null,
  uses: null
}
Mint Address => 7dAxpgsiNMGfzDsK21mnL99Ea7JsArCR4dCGofPraBsv
*/